var request = require('supertest');

describe('CharacterController', function() {

    describe('#list()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/characters').expect(200).end(done);
        });
    }),

    describe('#new()', function() {
        it('should be successful', function(done) {
            request(sails.hooks.http.app).get('/character/new').expect(200).end(done);
        });
    }),

    describe('#save()', function() {
        it('should insert data', function(done) {
            var newChar = {
                character: {
                    firstName: 'Test', lastName: 'Test', trigram: 'TES', sex: 'F', archetypes: {BLM: 5},
                    crafts: {}, harvesters: {}, fightType: 'offense', avatar: 'default.png', tribe: 'test',
                    moral: 20, ethics: 40, language: 'en', server: 'Moogle',
                    race: {name: 'test', lifespan: 10, tribes: ['test']}, god: {name: 'test', desc: 'test', element: 'test'},
                    birthPlace: {name: 'test', region: 'test'}, user: {}
                }
            };
            request(sails.hooks.http.app).post('/character/save').send(newChar).expect(200).end(done);
        }),

        it('should update existing data', function(done) {
            Character.find().limit(1).exec(function(err, result) {
                if (err) return done(err);
                result[0].firstName = 'Test 2';
                request(sails.hooks.http.app).post('/character/save').send({character: result[0]}).expect(200).end(done);
            });
        }),

        it('should detect double', function(done) {
            var newChar = {
                character: {
                    firstName: 'Test', lastName: 'Test', trigram: 'TES', sex: 'F', archetypes: {BLM: 5},
                    crafts: {}, harvesters: {}, fightType: 'offense', avatar: 'default.png', tribe: 'test',
                    moral: 20, ethics: 40, language: 'en', server: 'Moogle',
                    race: {name: 'test', lifespan: 10, tribes: ['test']}, god: {name: 'test', desc: 'test', element: 'test'},
                    birthPlace: {name: 'test', region: 'test'}, user: {}
                }
            };
            request(sails.hooks.http.app).post('/character/save').send(newChar).expect(500).end(done);
        }),

        it("should be detect missing fields", function(done) {
            var newChar = {
                character: {
                    firstName: 'Test', lastName: 'Test', sex: 'F', archetypes: {BLM: 5},
                    crafts: {}, harvesters: {}, fightType: 'offense', avatar: 'default.png', tribe: 'test',
                    moral: 20, ethics: 40, language: 'en', server: 'Moogle',
                    race: {name: 'test', lifespan: 10, tribes: ['test']}, god: {name: 'test', desc: 'test', element: 'test'},
                    birthPlace: {name: 'test', region: 'test'}, user: {}
                }
            };
            request(sails.hooks.http.app).post("/character/save").send(newChar).expect(500).end(done);
        });
    }),

    describe('#delete()', function() {
        it("should be successful", function(done) {
            Character.find().limit(1).exec(function(err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).delete("/character/remove/" + result[0].id).expect(200).end(done);
            });
        });
    });

});