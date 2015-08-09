var request = require('supertest');

describe('AuthController', function() {

    beforeEach(function(done) {
        sails.config.mockLogin = false;
        done();
    });

    after(function(done) {
        sails.config.mockLogin = true;
        done();
    });

    describe('#login()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/partials/login').expect(200, done);
        });

        it('should redirect logout users', function (done) {
            sails.config.mockLogin = true;
            request(sails.hooks.http.app).get('/partials/login').expect(302, done);
        });
    });

    describe('#logout()', function () {
        it('should be successful', function (done) {
            sails.config.mockLogin = true;
            request(sails.hooks.http.app).get('/logout').expect(302, done);
        });

        it('should be successful even with logged out users', function (done) {
            request(sails.hooks.http.app).get('/logout').expect(302, done);
        });
    });

    describe('#callback()', function () {
        it('should not be successful with unknown provider', function (done) {
            request(sails.hooks.http.app).get('/auth/abc/callback').expect(500, done);
        });
    });
});