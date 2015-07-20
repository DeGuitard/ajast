/**
 * CharacterController
 *
 * @description :: Server-side logic for managing characters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    search: function(req, res) {
        var term = ".*" + req.param('term') + ".*";
        // Native request to limit the fields... because Sails can't handle projection...
        Character.native(function(err, Collection) {
            Collection.find({
                fullName: {$regex: term, $options: 'i'}
            }, {trigram: 1, fullName: 1, fightType: 1, archetypes: 1, _id: 1}).toArray(function(err, result) {
                res.send(result);
            });
        });
    },

    list: function(req, res) {
        Character.native(function(err, Collection) {
            Collection.find({}, {fullName: 1, firstName: 1, lastName: 1, trigram: 1, avatar: 1, archetypes: 1, user: 1, _id: 1}).toArray(function(err, result) {
                res.view('character/index', {
                    title: 'Liste des personnages RP',
                    metaDesc: 'Retrouvez tous les personnages RP de Final Fantasy XIV. Vous aussi, créez votre fiche, et connectez-vous avec les autres rôlistes de FFXIV !',
                    characters: JSON.stringify(result)
                });
            });
        });
    },

    show: function(req, res) {
        if (!req.param("name")) return res.notFound();

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
            character: function(callback) {
                var query = {fullName: req.param("name")};
                Character.findOne(query).populate('god').populate('birthPlace').populate('race').populate('membership').populate('leadership').exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            }
        }, function(err, data) {
            if (err) return res.serverError(err);
            if (!data.character) return res.notFound("Ce personnage n'existe pas / plus.");
            res.view('character/show', {
                title: data.character.fullName,
                metaDesc: 'Profil de ' + data.character.fullName + ', un joueur qui fait du RP sur FFXIV. Retrouvez tous les détails dans son profil : âge, race, compétences, description physique…',
                character: data.character,
                archetypes: JSON.stringify(data.archetypes)
            });
        });
    },

    new: function(req, res) {
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
            gods: function(callback) {
                God.find().exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            },
            towns: function(callback) {
                Town.find().exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            },
            races: function(callback) {
                Race.find().exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            }
        }, function(err, data) {
            if (err) return res.serverError(err);

            var regions  = [], character = {'timeline': [], 'archetypes': {}, 'crafts': {}, 'harvesters': {}, avatar: 'default.png', moral: 40, ethics: 40};
            for (var i = 0; i < data.towns.length; i++) {
                if (regions.indexOf(data.towns[i].region) == -1) {
                    regions.push(data.towns[i].region);
                }
            }
            res.view('character/edit', {
                title: 'Créer un nouveau personnage',
                metaDesc: '',
                character: JSON.stringify(character),
                archetypes: JSON.stringify(data.archetypes),
                gods: JSON.stringify(data.gods),
                towns: JSON.stringify(data.towns),
                races: JSON.stringify(data.races),
                regions: JSON.stringify(regions)
            });
        });
    },

    edit: function(req, res) {
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
            character: function(callback) {
                var query = {id: req.param("id")};
                Character.findOne(query).exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            },
            gods: function(callback) {
                God.find().exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            },
            towns: function(callback) {
                Town.find().exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            },
            races: function(callback) {
                Race.find().exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            }
        }, function(err, data) {
            if (err) return res.serverError(err);
            if (!data.character) return res.notFound("Ce personnage n'existe pas / plus.");
            else if (data.character.user != req.user.id && data.character.user) return res.forbidden("Vous n'êtes pas le propriétaire de ce personnage !");

            var regions  = [];
            for (var i = 0; i < data.towns.length; i++) {
                if (regions.indexOf(data.towns[i].region) == -1) {
                    regions.push(data.towns[i].region);
                }
            }
            res.view('character/edit', {
                title: 'Édition de ' + data.character.fullName,
                metaDesc: '',
                character: JSON.stringify(data.character),
                archetypes: JSON.stringify(data.archetypes),
                gods: JSON.stringify(data.gods),
                towns: JSON.stringify(data.towns),
                races: JSON.stringify(data.races),
                regions: JSON.stringify(regions)
            });
        });
    },

    save: function(req, res) {
        var character = req.param('character');

        Character.findOne({id: character.id}).exec(function(err, result) {
            if (err) return res.serverError(err);
            if (!result || !result.user) character.user = req.user.id;
            else if (result.user != req.user.id) return res.forbidden("Vous n'êtes pas le propriétaire de ce personnage !");

            character.fullName = character.firstName + " " + character.lastName;

            Character.findOne({or: [
                {fullName : character.fullName},
                {trigram : character.trigram}
            ],
                id: { '!': character.id }
            }).exec(function(err, duplicate) {
                if (err) return res.serverError(err);
                if (duplicate) return res.send(409);
                if (!result) {
                    Character.create(character).exec(function (err, result) {
                        if (err) return res.serverError(err);
                        return res.send(result);
                    });
                } else {
                    Character.update({id: character.id}, character).exec(function (err, result) {
                        if (err) return res.serverError(err.originalError.message);
                        return res.send(result);
                    });
                }
            });
        });
    },

    remove: function(req, res) {
        Character.findOne({id: req.param('id')}).exec(function(err, result) {
            if (result.user != req.user.id) return res.forbidden("Vous n'êtes pas le propriétaire de ce personnage !");

            Character.destroy({id: result.id}).exec(function(err, result) {
                return res.ok();
            });
        });
    }
};