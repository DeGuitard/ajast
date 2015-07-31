/**
 * CharacterController
 *
 * @description :: Server-side logic for managing characters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    find: function(req, res) {
        var query = {},
            offset = req.param('offset', 0);

        if (req.param('term')) query.fullName = {contains: req.param('term')};

        Character.find(query, {
            fields: {
                fullName: 1, firstName: 1, lastName: 1, trigram: 1, avatar: 1,
                fightType:1, archetypes: 1, user: 1, server: 1, updatedAt: 1, _id: 1
            }
        }).skip(offset).limit(15).exec(function(err, result) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            res.send(result);
        });
    },

    list: function(req, res) {
        async.parallel({
            characters: function(callback) {
                Character.native(function(err, Collection) {
                    Collection.find({}, {fullName: 1, firstName: 1, lastName: 1, trigram: 1, avatar: 1, archetypes: 1, user: 1, server: 1, updatedAt: 1, _id: 1}).toArray(callback);
                });
            },
            servers: function(callback) {
                Server.find().exec(callback);
            }
        }, function(err, data) {
            var datacenters = [];
            for (var i = 0; i < data.servers.length; i++) {
                if (datacenters.indexOf(data.servers[i].datacenter) == -1) {
                    datacenters.push(data.servers[i].datacenter);
                }
            }
            res.view('character/index', {
                title: 'titles.char.list',
                metaDesc: 'Retrouvez tous les personnages RP de Final Fantasy XIV. Vous aussi, créez votre fiche, et connectez-vous avec les autres rôlistes de FFXIV !',
                characters: JSON.stringify(data.characters),
                servers: JSON.stringify(data.servers),
                datacenters: JSON.stringify(datacenters)
            });
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
            character: function(callback) {
                var query = {fullName: req.param("name")};
                Character.findOne(query).populate('god').populate('birthPlace').populate('race').populate('membership').populate('leadership').exec(callback);
            }
        }, function(err, data) {
            /* istanbul ignore if */
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
                    Collection.find({}, {desc: 0, _id: 0}).toArray(callback);
                });
            },
            gods: function(callback) {
                God.find().exec(callback);
            },
            towns: function(callback) {
                Town.find().exec(callback);
            },
            races: function(callback) {
                Race.find().exec(callback);
            },
            servers: function(callback) {
                Server.find().exec(callback);
            }
        }, function(err, data) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);

            var regions  = [], character = {'timeline': [], 'archetypes': {}, 'crafts': {}, 'harvesters': {}, avatar: 'default.png', moral: 40, ethics: 40};
            for (var i = 0; i < data.towns.length; i++) {
                if (regions.indexOf(data.towns[i].region) == -1) {
                    regions.push(data.towns[i].region);
                }
            }
            var datacenters = [];
            for (var i = 0; i < data.servers.length; i++) {
                if (datacenters.indexOf(data.servers[i].datacenter) == -1) {
                    datacenters.push(data.servers[i].datacenter);
                }
            }

            res.view('character/edit', {
                title: 'titles.char.new',
                metaDesc: '',
                character: JSON.stringify(character),
                archetypes: JSON.stringify(data.archetypes),
                gods: JSON.stringify(data.gods),
                towns: JSON.stringify(data.towns),
                races: JSON.stringify(data.races),
                regions: JSON.stringify(regions),
                servers: JSON.stringify(data.servers),
                datacenters: JSON.stringify(datacenters)
            });
        });
    },

    edit: function(req, res) {
        async.parallel({
            archetypes: function(callback) {
                // Native request to limit the fields, because Sails can't handle projection...
                Archetype.native(function(err, Collection) {
                    Collection.find({}, {desc: 0, _id: 0}).toArray(callback);
                });
            },
            character: function(callback) {
                var query = {id: req.param("id")};
                Character.findOne(query).exec(callback);
            },
            gods: function(callback) {
                God.find().exec(callback);
            },
            towns: function(callback) {
                Town.find().exec(callback);
            },
            races: function(callback) {
                Race.find().exec(callback);
            },
            servers: function(callback) {
                Server.find().exec(callback);
            }
        }, function(err, data) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!data.character) return res.notFound("Ce personnage n'existe pas / plus.");
            else if (data.character.user != req.user.id && data.character.user) return res.forbidden("Vous n'êtes pas le propriétaire de ce personnage !");

            var regions  = [], datacenters = [];
            for (var i = 0; i < data.towns.length; i++) {
                if (regions.indexOf(data.towns[i].region) == -1) {
                    regions.push(data.towns[i].region);
                }
            }

            for (var i = 0; i < data.servers.length; i++) {
                if (datacenters.indexOf(data.servers[i].datacenter) == -1) {
                    datacenters.push(data.servers[i].datacenter);
                }
            }
            res.view('character/edit', {
                title: 'titles.char.edit',
                metaDesc: '',
                name: data.character.fullName,
                character: JSON.stringify(data.character),
                archetypes: JSON.stringify(data.archetypes),
                gods: JSON.stringify(data.gods),
                towns: JSON.stringify(data.towns),
                races: JSON.stringify(data.races),
                regions: JSON.stringify(regions),
                datacenters: JSON.stringify(datacenters),
                servers: JSON.stringify(data.servers)
            });
        });
    },

    save: function(req, res) {
        var character = req.param('character');
        if (!character) return res.userError('characters.notices.corruptData');

        Character.findOne({id: character.id}).exec(function(err, result) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!result || !result.user) character.user = req.user.id;
            else if (result.user != req.user.id) return res.forbidden("Vous n'êtes pas le propriétaire de ce personnage !");

            character.fullName = character.firstName + " " + character.lastName;

            Character.findOne({or: [
                {fullName : character.fullName},
                {trigram : character.trigram}
            ],
                server: character.server,
                id: { '!': character.id }
            }).exec(function(err, duplicate) {
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                if (duplicate) return res.userError('characters.notices.conflictError');
                if (!result) {
                    Character.create(character).exec(function (err, result) {
                        /* istanbul ignore if */
                        if (err) return res.serverError(err);
                        return res.send(result);
                    });
                } else {
                    Character.update({id: character.id}, character).exec(function (err, result) {
                        /* istanbul ignore if */
                        if (err) return res.serverError(err);
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
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                return res.ok();
            });
        });
    }
};