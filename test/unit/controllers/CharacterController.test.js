var request = require('supertest');

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
            request(sails.hooks.http.app).get('/characters').expect(200, done);
        });
    });

    describe('#new()', function() {
        it('should be successful', function(done) {
            request(sails.hooks.http.app).get('/character/new').expect(200, done);
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

        it('should detect overpowered character', function(done) {
            character.character.firstName = 'Test 3';
            character.character.trigram = 'T99';
            character.character.archetypes.BRD = 3;
            character.character.archetypes.WHM = 4;
            request(sails.hooks.http.app).post('/character/save').send(character).expect(500, done);
        });

        it("should be detect missing fields", function(done) {
            character.trigram = undefined;
            request(sails.hooks.http.app).post("/character/save").send(character).end(function(err, res) {
                res.statusCode.should.be.exactly(500);
                Character.find().exec(function(err, characters) {
                    characters.length.should.be.eql(1);
                    done();
                });
            });
        });
    });

    describe('#search()', function() {
        it('should be successful', function(done) {
            Character.find().limit(1).exec(function (err, results) {
                if (err) return done(err);
                var char = results[0],
                    expectation = {
                        trigram: char.trigram, fullName: char.fullName, fightType: char.fightType,
                        archetypes: char.archetypes, _id: char.id
                    };
                request(sails.hooks.http.app).get('/character/find/' + char.fullName.substring(1,4)).expect([expectation], done);
            });
        });

        it('should not find nonexistent characters', function(done) {
            request(sails.hooks.http.app).get('/character/find/napoleon').expect([], done);
        });
    });

    describe('#show()', function() {
        it('should be successful', function(done) {
            Character.find().limit(1).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/character/show/' + result[0].fullName).expect(200, done);
            });
        });

        it('should not find nonexistent characters', function(done) {
            request(sails.hooks.http.app).get('/character/show/abc').expect(404, done);
        });
    });

    describe('#edit()', function() {
        it('should be successful', function(done) {
            Character.find().limit(1).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/character/edit/' + result[0].id).expect(200, done);
            });
        });

        it('should not authorize to edit nonexistent characters', function(done) {
            request(sails.hooks.http.app).get('/character/edit/abc').expect(404, done);
        });

        it('should restrict edit access to owner', function(done) {
            Character.update({}, {user: 'test2'}).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/character/edit/' + result[0].id).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Character.update({}, {user: 'test'}).exec(done);
                });
            });
        });
    });

    describe('#delete()', function() {
        it("should be successful", function(done) {
            Character.find().limit(1).exec(function(err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).delete("/character/remove/" + result[0].id).end(function(err, res) {
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