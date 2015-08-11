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
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            return res.send(list);
        });
    },

    accept: function(req, res) {
        if (!req.user) return res.forbidden("Vous devez être connecté pour ce type d'opération.");
        var self = this;

        Notification.findOne({id: req.param('id')}).exec(function(err, notification) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            else if (!notification) return res.notFound("La notification n'exite pas / plus.");
            else if (notification.target != req.user.id) return res.forbidden("Vous n'êtes pas le destinataire de cette notification.");

            if (notification.type == 'fc-invite') return self._acceptFcInvite(notification, res);
        });
    },

    decline: function(req, res) {
        if (!req.user) return res.forbidden("Vous devez être connecté pour ce type d'opération.");
        var self = this;

        Notification.findOne({id: req.param('id')}).exec(function(err, notification) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            else if (!notification) return res.notFound("La notification n'exite pas / plus.");
            else if (notification.target != req.user.id) return res.forbidden("Vous n'êtes pas le destinataire de cette notification.");

            if (notification.type == 'fc-invite') return self._declineFcInvite(notification, res);
        });
    },

    _acceptFcInvite: function(notification, res) {
        var character = notification.data.character,
            freeCompany = notification.data.freeCompany;

        async.series({
            character: function(callback) {
                Character.update({id: character.id}, {isInvited: false}).exec(callback);
            },
            notification: function(callback) {
                Notification.destroy({id: notification.id}).exec(callback);
            },
            company: function(callback) {
                FreeCompany.updatePlayersCount(freeCompany.id, callback);
            }
        }, function(err, data) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            else return res.ok();
        });
    },

    _declineFcInvite: function(notification, res) {
        var character = notification.data.character,
            freeCompany = notification.data.freeCompany;

        FreeCompany.findOne({id: freeCompany.id}).exec(function(err, result) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);

            async.parallel({
                character: function(callback) {
                    Character.update({id: character.id}, {isInvited: false, membership: undefined, leadership: undefined}).exec(callback);
                },
                notification: function(callback) {
                    Notification.destroy({id: notification.id}).exec(callback);
                },
                company: function(callback) {
                    FreeCompany.updatePlayersCount(freeCompany.id, callback);
                }
            }, function(err, data) {
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                else return res.ok();
            });
        });
    }
};

