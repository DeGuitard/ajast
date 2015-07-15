/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs'),
    path = require('path');

module.exports = {
    uploadAvatar: function (req, res) {
        var folder = path.resolve('.', 'uploads/avatars');
        this._upload(req, res, folder);
    },

    uploadFcIcon: function (req, res) {
        var folder = path.resolve('.', 'uploads/fcicons');
        this._upload(req, res, folder);
    },

    _upload: function (req, res, folder) {
        req.file('file').upload({dirname: folder}, function (err, uploadedFiles) {
            if (err) return res.send(500, err);
            return res.json({
                success: true,
                flowFilename: path.basename(uploadedFiles[0].fd)
            });
        });
    }
};