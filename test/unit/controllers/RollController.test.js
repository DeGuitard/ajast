var request = require('supertest');

describe('RollController', function() {

    describe('#index()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/rolls').expect(200).end(done);
        });
    });

    describe('#apiList()', function () {
        it('should return zero result', function (done) {
            request(sails.hooks.http.app).get('/api/roll').expect([], done);
        });

        it('should return one result', function (done) {
            var roll = {action: 'test', faces: 6, score: 6};
            Roll.create(roll).exec(function(err, result) {
                request(sails.hooks.http.app).get('/api/roll').expect(200).end(function(err, res) {
                    if (err) done(err);
                    res.body.length.should.be.eql(1);
                    res.body[0].action.should.be.exactly(roll.action);
                    res.body[0].faces.should.be.exactly(roll.faces);
                    res.body[0].score.should.be.exactly(roll.score);
                    done();
                });
            });
        });
    });

    describe('#apiNew()', function () {
        it('should create a new roll', function (done) {
            var roll = {action: 'test2', faces: 100, score: 120};
            request(sails.hooks.http.app).post('/api/roll').send(roll).expect(200).end(function(err, res) {
                Roll.findOne({action: roll.action}).exec(function(err, result) {
                    if (err) done(err);
                    result.faces.should.be.exactly(roll.faces);
                    result.score.should.not.be.exactly(roll.score);
                    done();
                });
            });
        });
    });
});