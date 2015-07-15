/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    list: function(req, res) {
        if (!req.user) return res.send([]);

        Notification.find({target: req.user.id}).exec(function (err, list) {
            if (err) return res.serverError(err);
            return res.send(list);
        });
    },

    accept: function(req, res) {
        if (!req.user) return res.forbidden("Vous devez être connecté pour ce type d'opération.");
        var self = this;

        Notification.findOne({id: req.param('id')}).exec(function(err, notification) {
            if (err) return res.serverError(err);
            else if (!notification) return res.notFound("La notification n'exite pas / plus.");
            else if (notification.target != req.user.id) return res.forbidden("Vous n'êtes pas le destinataire de cette notification.");

            if (notification.type == 'fc-invite') return self._acceptFcInvite(notification, res);
            else return res.serverError('Type de notification inconnu.');
        });
    },

    decline: function(req, res) {
        if (!req.user) return res.forbidden("Vous devez être connecté pour ce type d'opération.");
        var self = this;

        Notification.findOne({id: req.param('id')}).exec(function(err, notification) {
            if (err) return res.serverError(err);
            else if (!notification) return res.notFound("La notification n'exite pas / plus.");
            else if (notification.target != req.user.id) return res.forbidden("Vous n'êtes pas le destinataire de cette notification.");

            if (notification.type == 'fc-invite') return self._declineFcInvite(notification, res);
            else return res.serverError('Type de notification inconnu.');
        });
    },

    _acceptFcInvite: function(notification, res) {
        var character = notification.data.character,
            freeCompany = notification.data.freeCompany;

        async.series({
            character: function(callback) {
                Character.update({id: character.id}, {isInvited: false}).exec(function (err, result) {
                    if (err) res.serverError(err);
                    else return callback(null, result);
                });
            },
            notification: function(callback) {
                Notification.destroy({id: notification.id}).exec(function(err, result) {
                    if (err) return callback(err);
                    else return callback(null, result);
                });
            },
            company: function(callback) {
                FreeCompany.updatePlayersCount(freeCompany.id, function(err, result) {
                    if (err) return callback(err);
                    else return callback(null, result);
                });
            }
        }, function(err, data) {
            if (err) return res.serverError(err);
            else return res.ok();
        });
    },

    _declineFcInvite: function(notification, res) {
        var character = notification.data.character,
            freeCompany = notification.data.freeCompany,
            founderIndex = freeCompany.founders.indexOf(character.id.toString()),
            memberIndex = freeCompany.members.indexOf(character.id.toString());

        if (founderIndex != -1) freeCompany.founders.splice(founderIndex, 1);
        if (memberIndex != -1) freeCompany.members.splice(memberIndex, 1);

        async.parallel({
            freeCompany: function(callback) {
                FreeCompany.update({id: freeCompany.id}, freeCompany).exec(function(err, result) {
                    if (err) return callback(err);
                    else return callback(null, result);
                });
            },
            character: function(callback) {
                Character.update({id: character.id}, {isInvited: false}).exec(function(err, result) {
                    if (err) return callback(err);
                    else return callback(null, result);
                });
            },
            notification: function(callback) {
                Notification.destroy({id: notification.id}).exec(function(err, result) {
                    if (err) return callback(err);
                    else return callback(null, result);
                });
            }
        }, function(err, data) {
            if (err) return res.serverError(err);
            else return res.ok();
        });
    }
};

