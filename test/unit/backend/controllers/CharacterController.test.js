var request = require('supertest'),
    should = require('should');

describe('CharacterController', function() {

    var character = {
        character: {
            firstName: 'Test', lastName: 'Test', trigram: 'TES', sex: 'F', archetypes: {BLM: 5},
            crafts: {}, harvesters: {}, fightType: 'offense', avatar: 'default.png', tribe: 'test',
            moral: 20, ethics: 40, language: 'en', server: 'Moogle',
            race: {name: 'test', lifespan: 10, tribes: ['test']}, god: {name: 'test', desc: 'test', element: 'test'},
            birthPlace: {name: 'test', region: 'test'}, user: {}
        }
    };

    describe('#list()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/partials/characters').expect(200, done);
        });
    });

    describe('#new()', function() {
        it('should be successful', function(done) {
            request(sails.hooks.http.app).get('/partials/character/new').expect(200, done);
        });
    });

    describe('#save()', function() {
        it('should insert data', function(done) {
            request(sails.hooks.http.app).post('/character/save').send(character).end(function(err, res) {
                res.statusCode.should.be.exactly(200);
                Character.find().exec(function(err, characters) {
                    characters.length.should.be.eql(1);
                    var char = characters[0];
                    char.firstName.should.be.eql(character.character.firstName);
                    char.lastName.should.be.eql(character.character.lastName);
                    char.sex.should.be.eql(character.character.sex);
                    char.fightType.should.be.eql(character.character.fightType);
                    done();
                });
            });
        });

        it('should update existing data', function(done) {
            Character.find().limit(1).exec(function(err, result) {
                if (err) return done(err);
                result[0].firstName = 'Test 2';
                request(sails.hooks.http.app).post('/character/save').send({character: result[0]}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Character.find().exec(function(err, characters) {
                        characters.length.should.be.eql(1);
                        characters[0].firstName.should.be.eql(result[0].firstName);
                        done();
                    });
                });
            });
        });

        it('should detect double', function(done) {
            request(sails.hooks.http.app).post('/character/save').send(character).end(function(err, res) {
                res.statusCode.should.be.exactly(500);
                res.error.text.should.be.exactly('characters.notices.conflictError');
                Character.find().exec(function(err, characters) {
                    characters.length.should.be.eql(1);
                    done();
                });
            });
        });

        it('should restrict save access to owner', function(done) {
            Character.update({}, {user: 'test2'}).exec(function (err, result) {
                request(sails.hooks.http.app).post('/character/save').send({character: result[0]}).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Character.update({}, {user: 'test'}).exec(done);
                });
            });
        });

        it('should detect overpowered character', function(done) {
            character.character.firstName = 'Test 3';
            character.character.trigram = 'T99';
            character.character.archetypes.BRD = 3;
            character.character.archetypes.WHM = 4;
            request(sails.hooks.http.app).post('/character/save').send(character).expect(500, done);
        });

        it("should be detect missing fields", function(done) {
            character.trigram = undefined;
            request(sails.hooks.http.app).post('/character/save').send(character).end(function(err, res) {
                res.statusCode.should.be.exactly(500);
                Character.find().exec(function(err, characters) {
                    characters.length.should.be.eql(1);
                    done();
                });
            });
        });

        it('should be detect missing data', function(done) {
            request(sails.hooks.http.app).post('/character/save').send({}).end(function (err, res) {
                res.statusCode.should.be.exactly(500);
                res.error.text.should.be.exactly('characters.notices.corruptData');
                done();
            });
        });
    });

    describe('#find()', function() {
        it('should successfuly find one character', function(done) {
            Character.find().limit(1).exec(function (err, results) {
                var char = results[0];
                request(sails.hooks.http.app).post('/api/character/find/').send({term: char.fullName.substring(1,4)}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    res.body[0].firstName.should.be.eql(char.firstName);
                    res.body[0].lastName.should.be.eql(char.lastName);
                    res.body[0].fullName.should.be.eql(char.fullName);
                    res.body[0].avatar.should.be.eql(char.avatar);
                    res.body[0].fightType.should.be.eql(char.fightType);
                    res.body[0].archetypes.should.be.eql(char.archetypes);
                    res.body[0].user.should.be.eql(char.user);
                    res.body[0].server.should.be.eql(char.server);
                    res.body[0].updatedAt.should.startWith('2015');
                    res.body[0].id.should.be.eql(char.id);
                    should.not.exist(res.body[0].race);
                    should.not.exist(res.body[0].tribe);
                    done();
                });
            });
        });

        it('should not find nonexistent characters', function(done) {
            request(sails.hooks.http.app).post('/api/character/find/').send({term: 'napoleon'}).expect([], done);
        });

        it('should return all characters if there is no criteria', function(done) {
            request(sails.hooks.http.app).post('/api/character/find/').end(function(err, res) {
                res.statusCode.should.be.exactly(200);
                res.body.length.should.be.above(0);
                done();
            });
        });

        it('should not find anything if offset is too high', function(done) {
            request(sails.hooks.http.app).post('/api/character/find/').send({offset: 400}).expect([], done);
        });
    });

    describe('#show()', function() {
        it('should be successful', function(done) {
            Character.find().limit(1).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/partials/character/show/' + result[0].fullName).expect(200, done);
            });
        });

        it('should not find nonexistent characters', function(done) {
            request(sails.hooks.http.app).get('/partials/character/show/abc').expect(404, done);
        });
    });

    describe('#edit()', function() {
        it('should be successful', function(done) {
            Character.find().limit(1).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/partials/character/edit/' + result[0].id).expect(200, done);
            });
        });

        it('should not authorize to edit nonexistent characters', function(done) {
            request(sails.hooks.http.app).get('/partials/character/edit/abc').expect(404, done);
        });

        it('should restrict edit access to owner', function(done) {
            Character.update({}, {user: 'test2'}).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/partials/character/edit/' + result[0].id).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Character.update({}, {user: 'test'}).exec(done);
                });
            });
        });
    });

    describe('#delete()', function() {
        it('should restrict removal to owner', function(done) {
            Character.update({}, {user: 'test2'}).exec(function (err, result) {
                request(sails.hooks.http.app).delete('/character/remove/' + result[0].id).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Character.update({}, {user: 'test'}).exec(done);
                });
            });
        });

        it("should be successful", function(done) {
            Character.find().limit(1).exec(function(err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).delete('/character/remove/' + result[0].id).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Character.find().exec(function(err, characters) {
                        characters.length.should.be.eql(0);
                        done();
                    });
                });
            });
        });
    });

});