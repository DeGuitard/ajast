/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs'),
    path = require('path');

module.exports = {
    upload: function (req, res) {
        var folder = path.resolve('.', 'uploads/avatars');
        req.file('file').upload({dirname: folder}, function (err, uploadedFiles) {
            if (err) return res.send(500, err);
            return res.json({
                success: true,
                flowFilename: path.basename(uploadedFiles[0].fd)
            });
        });
    }
};