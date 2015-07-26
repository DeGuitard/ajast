var request = require('supertest');

describe('FreeCompanyController', function() {

    describe('#list()', function() {
        it("should be successful", function(done) {
            request(sails.hooks.http.app).get("/free-companies").expect(200).end(done);
        });
    });

    describe('#new()', function() {
        it("should be successful", function(done) {
            request(sails.hooks.http.app).get("/free-company/new").expect(200).end(done);
        });
    });

    describe('#save()', function() {
        it("should insert data", function(done) {
            var newFc = {
                freeCompany: {
                    desc: 'Test', name: 'Test', tag: 'TES', server: 'Moogle', url: 'test', icon: 'default.png',
                    isRecruiting: true, address: {}, founders: [], members: [], users: ['test']
                }
            };
            request(sails.hooks.http.app).post("/free-company/save").send(newFc).expect(200).end(done);
        });

        it("should update existing data", function(done) {
            FreeCompany.find().populate('founders').populate('members').limit(1).exec(function(err, result) {
                if (err) return done(err);
                result[0].name = 'Test 2';
                request(sails.hooks.http.app).post("/free-company/save").send({freeCompany: result[0]}).expect(200).end(done);
            });
        });

        it("should detect double", function(done) {
            var newFc = {
                freeCompany: {
                    desc: 'Test', name: 'Test 2', tag: 'TES', server: 'Moogle', url: 'test', icon: 'default.png',
                    isRecruiting: true, address: {}, founders: [], members: [], users: ['test']
                }
            };
            request(sails.hooks.http.app).post("/free-company/save").send(newFc).expect(500).end(done);
        });

        it("should be detect missing fields", function(done) {
            var newFc = {
                freeCompany: {
                    desc: 'Test', tag: 'TES', server: 'Moogle', url: 'test', icon: 'default',
                    isRecruiting: true, address: {}, founders: [], members: [], users: ['test']
                }
            };
            request(sails.hooks.http.app).post("/free-company/save").send(newFc).expect(500).end(done);
        });
    });

    describe('#delete()', function() {
        it("should be successful", function(done) {
            FreeCompany.find().limit(1).exec(function(err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).delete("/free-company/remove/" + result[0].id).expect(200).end(done);
            });
        });
    });
});