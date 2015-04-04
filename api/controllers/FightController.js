/**
 * FightController
 *
 * @description :: Server-side logic for managing fights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');

module.exports = {

    index: function(req, res) {
        async.parallel(
            {
                fights: function(callback) {
                    Fight.native(function(err, Collection) {
                        Collection.find({}, {shortid: 1, "time.hasStarted": 1, "time.isFinished": 1}).toArray(function(err, result) {
                            callback(null, result);
                        });
                    });
                },
                myFights: function(callback) {
                    if (req.user) {
                        Fight.native(function (err, Collection) {
                            Collection.find({mj: req.user.id, "time.hasStarted": false}, {shortid: 1}).toArray(function (err, result) {
                                callback(null, result);
                            });
                        });
                    } else {
                        callback(null, []);
                    }
                }
            },
            function(err, data) {
                res.view({
                    fights: JSON.stringify(data.fights),
                    myFights: JSON.stringify(data.myFights)
                });
            }
        );
    },

    create: function(req, res) {
        var fight = {
            mj: req.user.id,
            groups: {
                groupA: {
                    name: 'Groupe A',
                    code: 'A',
                    players: []
                },
                groupB: {
                    name: 'Groupe B',
                    code: 'B',
                    players: []
                },
                tmp: []
            },
            time: {
                current: {},
                actions: [],
                hasStarted: false,
                isFinished: false
            }
        };

        Fight.create(fight).exec(function(err, data) {
            res.redirect('/fight/' + data.shortid);
        });
    },

    show: function(req, res) {

        async.parallel({
            archetypes: function(callback) {
                // Native request to limit the fields, because Sails can't handle projection...
                Archetype.native(function(err, Collection) {
                    Collection.find({}, {desc: 0, _id: 0}).toArray(function(err, result) {
                        if (err) callback(err);
                        callback(null, result);
                    });
                });
            },
            fight: function(callback) {
                var query = {shortid: req.param("id")};
                Fight.findOne(query).exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                })
            }
        }, function(err, data) {
            if (err) return res.serverError(err);
            if (!data.fight || !data.archetypes) return res.notFound();
            if (!req.user || data.fight.mj != req.user.id) {
                res.view('fight/pj', {
                    archetypes: JSON.stringify(data.archetypes),
                    fight: JSON.stringify(data.fight)
                });
            } else {
                res.view('fight/mj', {
                    archetypes: JSON.stringify(data.archetypes),
                    fight: JSON.stringify(data.fight)
                });
            }
        });
    },

    refresh: function(req, res) {
        var id = req.param("id"),
            self = this;

        Fight.findOne({id: id}).exec(function(err, result) {
            if (result.mj != req.user.id) {
                res.forbidden("Vous n'êtes pas le MJ de ce combat.");
                return;
            }

            if (!result.time.hasStarted) {
                result.time.hasStarted = true;
                result.time.current.index = 1;
            }

            // Adds actions.
            var players = result.groups.groupA.players.concat(result.groups.groupB.players);
            result.time.actions = self._addActions(result.time.actions, players, result.time.current.index, true);

            Fight.update({id: id}, result).exec(function(err, result) {
                Fight.publishUpdate(result[0].id, {fight: result[0], action: 'refresh'});
                res.send(result[0].time);
            });
        });

    },

    roll: function(req, res) {
        var id = req.param("id"),
            action = req.param("action"),
            self = this;

        Fight.findOne({id: id}).exec(function(err, result) {
            if (result.mj != req.user.id) {
                res.forbidden("Vous n'êtes pas le MJ de ce combat.");
                return;
            }

            // Initializes the new actions & rolls.
            var index = result.time.actions.length - result.time.current.index;
            result.time.actions[index].desc = action.desc;
            result.time.actions[index].archetype = action.archetype;
            result.time.actions[index].type = action.type;
            result.time.actions[index].target = action.target;
            result.time.actions[index].roll = self._getRoll(action.archetype, action.source, action.type);
            result.time.current.index++;

            // Adds more actions if needed.
            var players = result.groups.groupA.players.concat(result.groups.groupB.players);
            if (self._needsMoreActions(result.time.actions)) {
                result.time.actions = self._addActions(result.time.actions, players, result.time.current.index, false);
            }

            Fight.update({id: id}, result).exec(function(err, result) {
                Fight.publishUpdate(result[0].id, {fight: result[0], action: 'roll'});
                res.send(result[0].time);
            });
        });
    },

    save: function(req, res) {
        var id = req.param("id"),
            data = req.param("data"),
            self = this;

        Fight.findOne({id: id}).exec(function(err, result) {
            if (result.mj != req.user.id) {
                res.forbidden("Vous n'êtes pas le MJ de ce combat.");
                return;
            }

            Fight.update({id: id}, data).exec(function(err, result) {
                Fight.publishUpdate(result[0].id, {fight: result[0], action: 'save'});
                res.status(200).send();
            });
        });
    },

    end: function(req, res) {
        var id = req.param("id"),
            self = this;

        Fight.findOne({id: id}).exec(function(err, result) {
            if (result.mj != req.user.id) {
                res.forbidden("Vous n'êtes pas le MJ de ce combat.");
                return;
            }

            if (result.time.hasStarted) {
                Fight.update({id: id}, {"time.isFinished": true}).exec(function(err, result) {
                    Fight.publishUpdate(result[0].id, {fight: result[0], action: 'end'});
                    res.redirect("/fights");
                });
            } else {
                Fight.destroy({id: id}).exec(function(err, result) {
                    res.redirect("/fights");
                });
            }
        });
    },

    apiGet: function(req, res) {
        var id = req.param('id');
        Fight.findOne({id: id}).exec(function(err, fight) {
            if (err) return res.serverError(err);
            if (!fight) return res.notFound();
            if (req.socket) Fight.subscribe(req.socket, fight, ['update']);
            return res.send(fight);
        });
    },

    _getRoll: function(archetype, player, type) {
        if (!archetype || !player || !player.archetypes[archetype]) return 0;

        var min = 0, max = 0, skill = player.archetypes[archetype];

        // 1: 0-25; 2: 0-50; 3:0-75; 4:50-100.
        if (skill == 1) {
            max = 25;
        } else if (skill == 2) {
            max = 50;
        } else if (skill == 3) {
            max = 75;
        } else if (skill == 4) {
            min = 25;
            max = 100;
        } else if (skill == 5) {
            min = 40;
            max = 100;
        }

        if (type == 'other') {
            min = 0;
            max = 100;
        } else if (type == player.fightType) {
            min += 10;
            max += 10;
        } else if (player.fightType != 'hybrid') {
            min -= 10;
            max -= 10;
        }

        if (min < 0) min = 0;
        if (max > 100) max = 100;

        return Math.floor(Math.random() * (max - min)) + min;
    },

    _getScore: function(archetype) {
        if (!archetype) return 0;

        var score = 0;
        // SCH = SMN > NIN = MNK > DRG = BRD > PLD = WAR > WHM = BLM
        if (archetype['SCH']) score += archetype['SCH'] * 19; // ex 5*18 = 95%
        if (archetype['SMN']) score += archetype['SMN'] * 19;
        if (archetype['NIN']) score += archetype['NIN'] * 18.5;
        if (archetype['MNK']) score += archetype['MNK'] * 18.5;
        if (archetype['DRG']) score += archetype['DRG'] * 18;
        if (archetype['BRD']) score += archetype['BRD'] * 18;
        if (archetype['PLD']) score += archetype['PLD'] * 17.5;
        if (archetype['WAR']) score += archetype['WAR'] * 17.5;
        if (archetype['WHM']) score += archetype['WHM'] * 17;
        if (archetype['BLM']) score += archetype['BLM'] * 17; // ex: 5*15 = 85%

        if (archetype['PNJ']) score += archetype['PNJ'] * 17;

        // For instance, SCH3 and SMN2 = 3*10 + 2*10 = 50.
        return score;
    },

    _needsMoreActions: function(actions) {
        var remainingActions = 0;

        for (var i = 0; i < actions.length; i++) {
            if (actions[i].roll) break;
            else remainingActions++;
        }

        return remainingActions <= 5;
    },

    _addActions: function(actions, players, currentIndex, reset) {
        var self = this,
            activePlayers = players.filter(function(player) {
            player.initiative = self._getScore(player.archetypes);
            return player.active;
        });
        activePlayers.sort(function(a, b) { return a.initiative - b.initiative; });

        // Iterates the list of players to fill .
        var newActions = [];
        while (newActions.length < 10) {
            for (var i = 0; i < activePlayers.length; i++) {
                var random = Math.random() * (100 - 1) + 1;
                if (activePlayers[i].initiative > random) {
                    newActions.push({source: activePlayers[i]});
                }
            }
        }

        // Adds the new actions to the previous one, removing all the "unrolled" actions.
        if (currentIndex == 1) return newActions;
        else {
            if (reset) {
                var trigrams = [], actionsClean = [], firstRollIndex = actions.length - currentIndex + 1;
                for (var i = 0; i < activePlayers.length; i++) {
                    trigrams.push(activePlayers[i].trigram);
                }
                actions.splice(0, firstRollIndex - trigrams.length);
                for (var i = 0; i < actions.length; i++) {
                    if (actions[i].roll || trigrams.indexOf(actions[i].source.trigram) != -1) {
                        actionsClean.push(actions[i]);
                    }
                }
                actions = actionsClean;
            }
            return newActions.concat(actions);
        }
    }
};