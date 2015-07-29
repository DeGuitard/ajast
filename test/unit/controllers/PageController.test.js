var request = require('supertest');

describe('PageController', function() {

    describe('#index()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/').expect(200).end(done);
        });
    });

    describe('#siteMap()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/sitemap.xml').expect(200).end(function(err, res) {
                res.text.should.startWith('<?xml version="1.0" encoding="UTF-8"?>');
                res.text.indexOf('http://xivrp.com/login').should.not.be.eql(-1);
                done();
            });
        });
    });

    describe('#lang()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/lang/fr').expect(200).end(function(err, res) {
                res.headers['set-cookie'][0].indexOf('lang=fr').should.not.be.eql(-1);
                done();
            });
        });
    });
});