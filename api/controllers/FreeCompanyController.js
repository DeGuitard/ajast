/**
 * FreeCompanyController
 *
 * @description :: Server-side logic for managing free companies (FreeCompany)
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    search: function(req, res) {
        // TODO : search free companies.
        return res.status(501).send();
    },

    list: function(req, res) {
        async.parallel({
            freeCompanies: function(callback) {
                FreeCompany
                    .find({}, {fields:
                                {   name: 1, tag: 1, isRecruiting: 1, trigram: 1, website: 1, icon: 1,
                                    users: 1, realPlayersCount: 1, server: 1, _id: 1 }
                    })
                    .sort('name ASC')
                    .exec(callback);
            },
            servers: function(callback) {
                Server.find().exec(callback);
            }
        }, function(err, data) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);

            var datacenters = [];
            for (var i = 0; i < data.servers.length; i++) {
                if (datacenters.indexOf(data.servers[i].datacenter) == -1) {
                    datacenters.push(data.servers[i].datacenter);
                }
            }

            res.view('freeCompany/index', {
                title: 'titles.fc.list',
                metaDesc: 'Retrouvez la liste des compagnies libres RP sur FFXIV ! Inscrivez la vôtre, cherchez votre future compagnie, trouvez des contacts, et plus encore.',
                freeCompanies: JSON.stringify(data.freeCompanies),
                servers: JSON.stringify(data.servers),
                datacenters: JSON.stringify(datacenters),
                layout: null
            });
        });

    },

    show: function(req, res) {
        FreeCompany.findOne({name: req.param("name")}).populate('founders').populate('members').exec(function(err, result) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!result) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            res.view('freeCompany/show', {
                title: result.name,
                metaDesc: 'Retrouvez tous les détails sur la CL ' + result.name + ' : ses membres, qui contacter, son adresse en jeu, où est leur forum/site et plus encore.',
                freeCompany: result,
                layout: null
            });
        });
    },

    new: function(req, res) {
        async.parallel({
            servers: function(callback) {
                Server.find().exec(callback);
            }
        }, function(err, data) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);

            var datacenters = [];
            for (var i = 0; i < data.servers.length; i++) {
                if (datacenters.indexOf(data.servers[i].datacenter) == -1) {
                    datacenters.push(data.servers[i].datacenter);
                }
            }

            res.view('freeCompany/edit', {
                title: 'titles.fc.new',
                metaDesc: '',
                freeCompany: JSON.stringify({members: [], founders: [], users: [req.user.id], isRecruiting: true, icon: 'default.png'}),
                servers: JSON.stringify(data.servers),
                datacenters: JSON.stringify(datacenters),
                layout: null
            });
        });
    },

    edit: function(req, res) {
        async.parallel({
            freeCompany: function(callback) {
                var query = {id: req.param("id")};
                FreeCompany.findOne(query).populate('founders').populate('members').exec(callback);
            },
            servers: function(callback) {
                Server.find().exec(callback);
            }
        }, function(err, data) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!data.freeCompany) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            else if (data.freeCompany.users.indexOf(req.user.id) == -1 && data.freeCompany.users.length > 0) return res.forbidden("Vous n'avez pas le droit de modifier cette compagnie libre !");

            var datacenters = [];
            for (var i = 0; i < data.servers.length; i++) {
                if (datacenters.indexOf(data.servers[i].datacenter) == -1) {
                    datacenters.push(data.servers[i].datacenter);
                }
            }

            res.view('freeCompany/edit', {
                title: 'titles.fc.edit',
                metaDesc: '',
                name: data.freeCompany.name,
                freeCompany: JSON.stringify(data.freeCompany),
                servers: JSON.stringify(data.servers),
                datacenters: JSON.stringify(datacenters),
                layout: null
            });
        });
    },

    save: function(req, res) {
        var freeCompany = req.param('freeCompany');
        if (!freeCompany) return res.userError('fc.notices.corruptData');

        FreeCompany.findOne({id: freeCompany.id}).exec(function(err, result) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            else if (result && result.users.length > 0 && result.users.indexOf(req.user.id) == -1) return res.forbidden("Vous n'avez pas le droit de modifier cette compagnie libre !");

            FreeCompany.findOne({
                name : freeCompany.name,
                server: freeCompany.server,
                id: { '!': freeCompany.id }
            }).exec(function(err, duplicate) {
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                if (duplicate) return res.userError('fc.notices.conflict');
                if (!result) {
                    FreeCompany.create(freeCompany).exec(function (err, result) {
                        /* istanbul ignore if */
                        if (err) return res.serverError(err);
                        return res.send(result);
                    });
                } else {
                    FreeCompany.update({id: freeCompany.id}, freeCompany).exec(function(err, result) {
                        /* istanbul ignore if */
                        if (err) return res.serverError(err.originalError.message);
                        FreeCompany.updatePlayersCount(freeCompany.id);
                        res.send(result);

                    });
                }
            });
        });
    },

    invite: function(req, res) {
        var fcId = req.param('freeCompany'),
            memberId = req.param('member'),
            isFounder = req.param('isFounder');

        if (!fcId) return res.userError('fc.notices.saveOnce');
        if (!memberId) return res.userError('fc.notices.corruptData');

        FreeCompany.findOne({id: fcId}).exec(function(err, freeCompany) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!freeCompany) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            else if (freeCompany.users.length > 0 && freeCompany.users.indexOf(req.user.id) == -1) return res.forbidden("Vous n'avez pas le droit de modifier cette compagnie libre !");

            Character.findOne({id: memberId}).exec(function(err, character) {
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                else if (!character) return res.notFound("Ce personnage n'existe pas / plus.");
                else if (character.isInvited) return res.userError('fc.notices.alreadyInvited');
                else if (character.leadership || character.membership) return res.userError('fc.notices.alreadyInside');

                async.series({
                    character: function(callback) {
                        var toUpdate = {isInvited: true};
                        if (isFounder) toUpdate.leadership = freeCompany.id;
                        else toUpdate.membership = freeCompany.id;
                        Character.update({id: character.id}, toUpdate).exec(callback);
                    },
                    invite: function(callback) {
                        var notif = {
                            type: 'fc-invite',
                            target: character.user,
                            data: {
                                freeCompany: freeCompany,
                                character: character
                            }
                        };
                        Notification.create(notif).exec(callback);
                    }
                }, function(err, data) {
                    /* istanbul ignore if */
                    if (err) return res.serverError(err);
                    return res.send(data.freeCompany);
                });
            });
        });
    },

    remove: function(req, res) {
        FreeCompany.findOne({id: req.param('id')}).exec(function(err, freeCompany) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (!freeCompany) {
                sails.log.warn('Tried to remove inexistent free company.');
                return res.notFound("Cette compagnie libre n'existe pas / plus.");
            }
            if (freeCompany.users.length > 0 && freeCompany.users.indexOf(req.user.id) == -1) {
                sails.log.warn('Tried to remove free company without according rights! user: ' + JSON.stringify(req.user));
                return res.forbidden("Vous n'avez pas le droit de modifier cette compagnie libre !");
            }

            async.series({
                characters: function(callback) {
                    Character.update({or: [{leadership: freeCompany.id}, {membership: freeCompany.id}]},
                    {leadership: undefined, membership: undefined, isInvited: false}).exec(callback);
                },
                notifications: function(callback) {
                    Notification.destroy({'data.freeCompany.id': freeCompany.id}).exec(callback);
                },
                freeCompany: function(callback) {
                    FreeCompany.destroy({id: freeCompany.id}).exec(callback);
                }
            }, function(err, data) {
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                return res.ok();
            });
        });
    }
};

