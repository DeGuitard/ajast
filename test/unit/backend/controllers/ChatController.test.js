var request = require('supertest'),
    should = require('should');

describe('ChatController', function() {

    describe('#index()', function () {
        it('should be successful when logged out', function (done) {
            sails.config.mockLogin = false;
            request(sails.hooks.http.app).get('/partials/chat').expect(200, done);
        });

        it('should be successful when logged in', function (done) {
            sails.config.mockLogin = true;
            request(sails.hooks.http.app).get('/partials/chat').expect(200, done);
        });
    });

    describe('#apiList()', function () {
        it('should return zero result', function (done) {
            request(sails.hooks.http.app).get('/api/chat').expect([], done);
        });

        it('should return one result', function (done) {
            var msg = {username: 'Severus Snape', text: 'Expelliarmus', avatar: 'default.png'};
            ChatMsg.create(msg).exec(function(err, result) {
                request(sails.hooks.http.app).get('/api/chat').expect(200).end(function(err, res) {
                    res.body.length.should.be.eql(1);
                    res.body[0].username.should.be.exactly(msg.username);
                    res.body[0].text.should.be.exactly(msg.text);
                    res.body[0].createdAt.should.startWith('2015');
                    done();
                });
            });
        });
    });

    describe('#apiNext()', function () {
        it('should return zero result if offset is too high', function (done) {
            request(sails.hooks.http.app).post('/api/chat/next').send({offset: 200}).expect([], done);
        });

        it('should return the first results if offset is at zero', function (done) {
            request(sails.hooks.http.app).post('/api/chat/next').send({offset: 0}).end(function(err, res) {
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('#apiSend()', function () {
        var character = {
                firstName: 'Test', lastName: 'Test', trigram: 'TES', sex: 'F', archetypes: {BLM: 5},
                crafts: {}, harvesters: {}, fightType: 'offense', avatar: 'default.png', tribe: 'test',
                moral: 20, ethics: 40, language: 'en', server: 'Moogle',
                race: {name: 'test', lifespan: 10, tribes: ['test']}, god: {name: 'test', desc: 'test', element: 'test'},
                birthPlace: {name: 'test', region: 'test'}, user: {}
        };

        it('should save the message in database', function (done) {
            var msg = {text: 'Wingardium leviosaaaa'};
            character.fullName = 'Harry Potter';
            character.user = 'test';
            character.avatar = 'harry-potter.jpg';
            Character.create(character).exec(function(err, result) {
                msg.character = result.id;
                request(sails.hooks.http.app).post('/api/chat').send(msg).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    ChatMsg.findOne({text: msg.text}).exec(function(err, result) {
                        should.exist(result);
                        result.username.should.be.eql('Harry Potter');
                        result.avatar.should.be.eql('harry-potter.jpg');
                        should.exist(result.createdAt);
                        done();
                    });
                });
            });
        });

        it('should set a default username if none is supplied', function (done) {
            var msg = {text: 'Avada Kedavra'};
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function(err, res) {
                res.statusCode.should.be.exactly(200);
                ChatMsg.findOne({text: msg.text}).exec(function(err, result) {
                    should.exist(result);
                    result.username.should.be.eql('chat.labels.anonymous');
                    result.avatar.should.be.eql('default.png');
                    done();
                });
            });
        });

        it('should set a default username if the specified character does not exist', function (done) {
            var msg = {character: 'doesnotexist', text: 'Lumos'};
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function(err, res) {
                res.statusCode.should.be.exactly(200);
                ChatMsg.findOne({text: msg.text}).exec(function(err, result) {
                    should.exist(result);
                    result.username.should.be.eql('chat.labels.anonymous');
                    result.avatar.should.be.eql('default.png');
                    done();
                });
            });
        });

        it('should set a default username if the specified character does not belong to the user', function (done) {
            var msg = {text: 'Crucio'};
            character.fullName = 'Bellatrix Lestrange';
            character.user = 'someone';
            Character.create(character).exec(function(err, result) {
                msg.character = result.id;
                request(sails.hooks.http.app).post('/api/chat').send(msg).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    res.error.text.should.be.exactly('chat.notices.notYourCharacter');
                    done();
                });
            });
        });

        it('should set a default username if the user tries to be admin without rights', function (done) {
            var msg = {text: 'Alohomora', character: 'admin'};
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function(err, res) {
                res.statusCode.should.be.exactly(200);
                res.body.username.should.be.eql('chat.labels.anonymous');
                res.body.avatar.should.be.eql('default.png');
                done();
            });
        });

        it('should set authorize admin nickname if the user has the rights', function (done) {
            var msg = {text: 'Accio', character: 'admin'};
            sails.config.mockAdmin = true;
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function(err, res) {
                res.statusCode.should.be.exactly(200);
                res.body.username.should.be.eql('chat.labels.admin');
                res.body.avatar.should.be.eql('admin.png');
                sails.config.mockAdmin = false;
                done();
            });
        });

        it('should detect missing fields', function (done) {
            var msg = {};
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function(err, res) {
                res.statusCode.should.be.exactly(500);
                res.error.text.should.be.exactly('chat.notices.missingFields');
                done();
            });
        });
    });
});