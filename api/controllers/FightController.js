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
                    Fight.find({}, {fields: { shortid: 1, "time.hasStarted": 1, "time.isFinished": 1, "updatedAt": 1}}).sort('updatedAt DESC').limit(30).exec(callback);
                },
                myFights: function(callback) {
                    if (req.user) {
                        Fight.find({mj: req.user.id, "time.hasStarted": false}, {fields: {shortid: 1}}).exec(callback);
                    } else {
                        callback(null, []);
                    }
                }
            },
            function(err, data) {
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                res.view({
                    title: 'titles.fight.list',
                    metaDesc: "Gérez vos combats Role Play (RP) avec fair play, simplicité et rapidité ; ou suivez en temps réel la progression d'un combat qui concerne votre personnage !",
                    fights: JSON.stringify(data.fights),
                    myFights: JSON.stringify(data.myFights),
                    layout: null
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
            res.redirect('/partials/fight/show/' + data.shortid);
        });
    },

    show: function(req, res) {

        async.parallel({
            archetypes: function(callback) {
                // Native request to limit the fields, because Sails can't handle projection...
                Archetype.native(function(err, Collection) {
                    Collection.find({}, {desc: 0, _id: 0}).toArray(callback);
                });
            },
            fight: function(callback) {
                var query = {shortid: req.param("id")};
                Fight.findOne(query).exec(callback)
            }
        }, function(err, data) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!data.fight || !data.archetypes) return res.notFound();
            if (!req.user || data.fight.mj != req.user.id) {
                res.view('fight/pj', {
                    title: 'titles.fight.show',
                    metaDesc: 'Suivez en direct live le combat RP entre les personnages et PNJs, afin de connaître en temps réel le déroulement du combat !',
                    archetypes: JSON.stringify(data.archetypes),
                    shortid: data.fight.shortid,
                    fight: JSON.stringify(data.fight),
                    layout: null
                });
            } else {
                res.view('fight/mj', {
                    title: 'titles.fight.edit',
                    metaDesc: '',
                    shortid: data.fight.shortid,
                    archetypes: JSON.stringify(data.archetypes),
                    fight: JSON.stringify(data.fight),
                    layout: null
                });
            }
        });
    },

    refresh: function(req, res) {
        var id = req.param("id"),
            self = this;

        if (!id) return res.serverError('Corrupt data');

        Fight.findOne({id: id}).exec(function(err, result) {
            if (!result) {
                return res.notFound('Combat introuvable.');
            } else if (result.mj != req.user.id) {
                return res.forbidden("Vous n'êtes pas le MJ de ce combat.");
            } else if (result.time.isFinished) {
                return res.forbidden('Ce combat est déjà fini.');
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

        if (!action || !id) return res.serverError('Corrupt data');

        Fight.findOne({id: id}).exec(function(err, result) {
            if (!result) {
                return res.notFound('Combat introuvable.');
            } else if (result.mj != req.user.id) {
                return res.forbidden("Vous n'êtes pas le MJ de ce combat.");
            } else if (result.time.isFinished) {
                return res.forbidden('Ce combat est déjà fini.')
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

        if (!id || !data) return res.serverError();

        Fight.findOne({id: id}).exec(function(err, result) {
            if (result.mj != req.user.id) {
                return res.forbidden("Vous n'êtes pas le MJ de ce combat.");
            }

            Fight.update({id: id}, data).exec(function(err, result) {
                Fight.publishUpdate(result[0].id, {fight: result[0], action: 'save'});
                return res.ok();
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
                    res.ok();
                });
            } else {
                Fight.destroy({id: id}).exec(function(err, result) {
                    res.ok();
                });
            }
        });
    },

    apiGet: function(req, res) {
        var id = req.param('id');
        Fight.findOne({id: id}).exec(function(err, fight) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!fight) return res.notFound();
            if (req.socket) Fight.subscribe(req.socket, fight, ['update']);
            return res.send(fight);
        });
    },

    _getRoll: function(archetype, player, type) {
        if (!archetype || !player || !player.archetypes[archetype]) return 0;

        var min = 1, max = 0, skill = player.archetypes[archetype];

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
            min = 1;
            max = 100;
        } else if (type == player.fightType) {
            min += 10;
            max += 10;
        } else if (player.fightType != 'hybrid') {
            min -= 10;
            max -= 10;
        }

        if (min < 1) min = 1;
        if (max > 100) max = 100;

        return Math.floor(Math.random() * (max - min)) + min;
    },

    _getScore: function(archetype) {
        if (!archetype) return 0;

        // SCH = SMN > NIN = MNK > DRG = BRD = MCN > PLD = WAR = DRK > WHM = BLM = AST
        var y = {
            SCH: -2.5, SMN: -2.5, NIN: -2, MNK: -2, DRG: -1, BRD: -1, MCN: -1,
            PLD: -0.25, WAR: -0.25, DRK: -0.25, WHM: 0, BLM: 0, AST: 0, PNJ: -1
        };

        var x = 0;
        for (var key in archetype) {
            x += archetype[key];
        }

        var mainArchetype = 'SCH';
        if (archetype['SMN'] > archetype[mainArchetype]) { mainArchetype = 'SMN'; }
        if (archetype['NIN'] > archetype[mainArchetype]) { mainArchetype = 'NIN'; }
        if (archetype['MNK'] > archetype[mainArchetype]) { mainArchetype = 'MNK'; }
        if (archetype['DRG'] > archetype[mainArchetype]) { mainArchetype = 'DRG'; }
        if (archetype['BRD'] > archetype[mainArchetype]) { mainArchetype = 'BRD'; }
        if (archetype['MCN'] > archetype[mainArchetype]) { mainArchetype = 'MCN'; }
        if (archetype['PLD'] > archetype[mainArchetype]) { mainArchetype = 'PLD'; }
        if (archetype['DRK'] > archetype[mainArchetype]) { mainArchetype = 'DRK'; }
        if (archetype['WAR'] > archetype[mainArchetype]) { mainArchetype = 'WAR'; }
        if (archetype['WHM'] > archetype[mainArchetype]) { mainArchetype = 'WHM'; }
        if (archetype['AST'] > archetype[mainArchetype]) { mainArchetype = 'AST'; }
        if (archetype['BLM'] > archetype[mainArchetype]) { mainArchetype = 'BLM'; }
        if (archetype['PNJ'] > archetype[mainArchetype]) { mainArchetype = 'PNJ'; }

        Math.log10 = Math.log10 || function(x) {
            return Math.log(x) / Math.LN10;
        };

        if (x == 0) return 0;
        return Math.log10(4*x)/-x + 68/(56 + y[mainArchetype]);
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
                if (activePlayers[i].initiative > Math.random()) {
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