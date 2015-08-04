/**
 * RollController
 *
 * @description :: Server-side logic for managing rolls
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index: function(req, res) {
        var render = function(characters) {
            res.view({
                title: 'titles.chat',
                metaDesc: 'Discutez avec la communauté RP de FFXIV, afin de faire connaissance avec d\'autres personnes.',
                characters: characters
            });
        };

        if (req.isAuthenticated()) {
            Character.find({user: req.user.id}).exec(function(err, characters) {
                /* istanbul ignore if */
                if (err) return res.serverError(err);
                render(characters);
            });
        } else {
            render([]);
        }
    },

    apiList: function(req, res) {
        ChatMsg.find({where: {}, limit: 30, sort: 'createdAt DESC'}).exec(function(err, msgs) {
            /* istanbul ignore if */
            if (err) return res.serverError(err);
            if (req.socket) ChatMsg.watch(req);
            return res.send(msgs);
        });
    },

    apiNew: function(req, res) {
        var character = req.param('character'),
            text = req.param('text'),
            createMessage = function(username, avatar) {
                ChatMsg.create({text: text, username: username, avatar: avatar}).exec(function(err, result) {
                    /* istanbul ignore if */
                    if (err) return res.serverError(err);
                    ChatMsg.publishCreate(result);
                    return res.send(result);
                });
            };

        if (!text) return res.serverError('chat.notices.missingFields');
        else if (!character || !req.isAuthenticated()) return createMessage('chat.labels.anonymous', 'default.png');

        Character.findOne({id: character}).exec(function(err, result) {
            if (!result) return createMessage('chat.labels.anonymous', 'default.png');
            else if (result.user != req.user.id) return res.forbidden('chat.notices.notYourCharacter');
            else return createMessage(result.fullName, result.avatar);
        });
    }
};
