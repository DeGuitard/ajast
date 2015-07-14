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
        FreeCompany.native(function(err, Collection) {
            Collection.find({}, {name: 1, tag: 1, isRecruiting: 1, trigram: 1, website: 1, icon: 1, users: 1, realPlayersCount: 1, _id: 1}).toArray(function(err, result) {
                return res.view('freeCompany/index', {freeCompanies: JSON.stringify(result)});
            });
        });
    },

    show: function(req, res) {
        FreeCompany.findOne({id: req.param("id")}).populate('founders').populate('members').exec(function(err, result) {
            if (err) return res.serverError(err);
            if (!result) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            res.view('freeCompany/show', { freeCompany: JSON.stringify(result) });
        });
    },

    new: function(req, res) {
        // TODO : sends a form to create a free company.
        return res.status(501).send();
    },

    edit: function(req, res) {
        async.parallel({
            freeCompany: function(callback) {
                var query = {id: req.param("id")};
                FreeCompany.findOne(query).populate('founders').populate('members').exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            },
            servers: function(callback) {
                Server.find().exec(function(err, result) {
                    if (err) callback(err);
                    callback(null, result);
                });
            }
        }, function(err, data) {
            if (err) return res.serverError(err);
            if (!data.freeCompany) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            else if (data.freeCompany.users.indexOf(req.user.id) == -1 && data.freeCompany.users.size > 0) return res.forbidden("Vous n'avez pas le droit de modifier cette compagnie libre !");

            res.view('freeCompany/edit', {
                freeCompany: JSON.stringify(data.freeCompany),
                servers: JSON.stringify(data.servers)
            });
        });
    },

    save: function(req, res) {
        var freeCompany = req.param('freeCompany');
        if (!freeCompany) return res.serverError('Données corrompues.');

        FreeCompany.findOne({id: freeCompany.id}).exec(function(err, result) {
            if (err) return res.serverError(err);
            if (!result) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            else if (result.users.length > 0 && result.users.indexOf(req.user.id) == -1) return res.forbidden("Vous n'avez pas le droit de modifier cette compagnie libre !");

            FreeCompany.findOne({
                name : freeCompany.name,
                id: { '!': freeCompany.id }
            }).exec(function(err, duplicate) {
                if (err) return res.serverError(err);
                if (duplicate) return res.send(409);
                if (!result) {
                    FreeCompany.create(freeCompany).exec(function (err, result) {
                        if (err) return res.serverError(err);
                        return res.send(result);
                    });
                } else {
                    FreeCompany.update({id: freeCompany.id}, freeCompany).exec(function(err, result) {
                        if (err) return res.serverError(err.originalError.message);
                        return res.send(result);
                    });
                }
            });
        });
    },

    invite: function(req, res) {
        var fcId = req.param('freeCompany'),
            memberId = req.param('member'),
            isFounder = req.param('isFounder');

        if (!fcId || !memberId) return res.serverError('Données corrompues.');

        FreeCompany.findOne({id: fcId}).exec(function(err, freeCompany) {
            if (err) return res.serverError(err);
            if (!freeCompany) return res.notFound("Cette compagnie libre n'existe pas / plus.");
            else if (freeCompany.users.length > 0 && freeCompany.users.indexOf(req.user.id) == -1) return res.forbidden("Vous n'avez pas le droit de modifier cette compagnie libre !");

            Character.findOne({id: memberId}).exec(function(err, character) {
                if (err) return res.serverError(err);
                else if (!character) return res.notFound("Ce personnage n'existe pas / plus.");
                else if (character.isInvited) return res.serverError('Ce personnage a déjà une invitation en cours.');
                else if (character.leadership || character.membership) return res.serverError('Ce personnage est déjà dans une compagnie libre.');

                if (isFounder) freeCompany.founders.push(character.id);
                else freeCompany.members.push(character.id);

                async.series({
                    character: function(callback) {
                        Character.update({id: character.id}, {isInvited: true}).exec(function(err, result) {
                            if (err) return callback(err);
                            else return callback(null, result);
                        });
                    },
                    freeCompany: function(callback) {
                        FreeCompany.update({id: freeCompany.id}, freeCompany).exec(function(err, result) {
                            if (err) return callback(err);
                            else return callback(null, result);
                        });
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
                        Notification.create(notif).exec(function(err, result) {
                            if (err) return callback(err);
                            else return callback(null, result);
                        });
                    }
                }, function(err, data) {
                    if (err) return res.serverError(err);
                    else return res.send(data.freeCompany);
                });
            });
        });
    },

    remove: function(req, res) {
        // TODO : removes a free company under strict conditions.
        return res.status(501).send();
    }
};

