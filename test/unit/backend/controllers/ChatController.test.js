var request = require('supertest'),
    should = require('should');

describe('ChatController', function() {

    describe('#index()', function () {
        it('should be successful when logged out', function (done) {
            sails.config.mockLogin = false;
            request(sails.hooks.http.app).get('/chat').expect(200, done);
        });

        it('should be successful when logged in', function (done) {
            sails.config.mockLogin = true;
            request(sails.hooks.http.app).get('/chat').expect(200, done);
        });
    });


    describe('#apiList()', function () {
        it('should return zero result', function (done) {
            request(sails.hooks.http.app).get('/api/chat').expect([], done);
        });

        it('should return one result', function (done) {
            var msg = {username: 'Severus Snape', txt: 'Expelliarmus', date: Date.now()};
            ChatMsg.create(msg).exec(function(err, result) {
                request(sails.hooks.http.app).get('/api/chat').expect(200).end(function(err, res) {
                    if (err) done(err);
                    res.body.length.should.be.eql(1);
                    res.body[0].action.should.be.exactly(msg.username);
                    res.body[0].txt.should.be.exactly(msg.txt);
                    res.body[0].date.should.startWith('2015');
                    done();
                });
            });
        });
    });

    describe('#apiSend()', function () {
        it('should save the message in database', function (done) {
            var msg = {character: 'test', text: 'Wingardium leviosaaaa'};
            Character.create({id: msg.character, fullName: 'Harry Potter', user: 'test'}).exec(function(err, result) {
                request(sails.hooks.http.app).post('/api/chat').send(msg).end(function() {
                    res.statusCode.should.be.exactly(200);
                    ChatMsg.findOne({text: msg.text}).exec(function(err, result) {
                        should.exist(result);
                        result.username.should.be.eql('Harry Potter');
                        result.date.indexOf('2015').should.not.be.eql(-1);
                        done();
                    });
                });
            });
        });

        it('should set a default username if none is supplied', function (done) {
            var msg = {text: 'Avada Kedavra'};
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function() {
                res.statusCode.should.be.exactly(200);
                ChatMsg.findOne({text: msg.text}).exec(function(err, result) {
                    should.exist(result);
                    result.username.should.be.eql('chat.label.anonymous');
                    done();
                });
            });
        });

        it('should set a default username if the specified character does not exist', function (done) {
            var msg = {character: 'doesnotexist', text: 'Lumos'};
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function() {
                res.statusCode.should.be.exactly(200);
                ChatMsg.findOne({text: msg.text}).exec(function(err, result) {
                    should.exist(result);
                    result.username.should.be.eql('chat.label.anonymous');
                    done();
                });
            });
        });

        it('should set a default username if the specified character does not belong to the user', function (done) {
            var msg = {character: 'someoneelse', text: 'Crucio'};
            Character.create({id: msg.character, fullName: 'Bellatrix Lestrange', user: 'someone'}).exec(function(err, result) {
                request(sails.hooks.http.app).post('/api/chat').send(msg).end(function () {
                    res.statusCode.should.be.exactly(200);
                    ChatMsg.findOne({text: msg.text}).exec(function (err, result) {
                        res.statusCode.should.be.exactly(403);
                        res.error.text.should.be.exactly('chat.notices.notYourCharacter');
                        done();
                    });
                });
            });
        });

        it('should detect missing fields', function (done) {
            var msg = {};
            request(sails.hooks.http.app).post('/api/chat').send(msg).end(function() {
                res.statusCode.should.be.exactly(500);
                res.error.text.should.be.exactly('chat.notices.missingFields');
                done();
            });
        });
    });
});