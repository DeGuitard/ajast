/**
 * RollController
 *
 * @description :: Server-side logic for managing rolls
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index: function(req, res) {
        res.view({title: 'Lancer de dés'});
    },

    apiList: function(req, res) {
        Roll.find({where: {}, limit: 30, sort: 'createdAt DESC'}).exec(function(err, rolls) {
            if (err) return res.serverError(err);
            if (req.socket) Roll.watch(req);
            return res.send(rolls);
        });
    },

    apiNew: function(req, res) {
        var action = req.param('action'),
            faces = req.param('faces'),
            score = Math.random() * (faces - 1) + 1;

        Roll.create({action: action, faces: faces, score: score}).exec(function(err, result) {
            if (err) return res.serverError(err);
            Roll.publishCreate(result);
            return res.send(result);
        });
    }
};
