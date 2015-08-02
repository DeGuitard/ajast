var request = require('supertest');

describe('UploadController', function() {

    describe('#uploadAvatar()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).post('/upload/avatar').attach('file', 'test/fixtures/img.png').end(function(err, res) {
                res.body.success.should.be.true();
                res.body.flowFilename.length.should.be.above(0);
                done();
            });
        });
    });

    describe('#uploadFcIcon()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).post('/upload/fcicon').attach('file', 'test/fixtures/img.png').end(function(err, res) {
                res.body.success.should.be.true();
                res.body.flowFilename.length.should.be.above(0);
                done();
            });
        });
    });
});