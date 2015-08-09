var request = require('supertest'),
    should = require('should');

describe('FightController', function() {

    describe('#index()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/partials/fights').expect(200, done);
        });

        it('should be successful even when not logged in', function (done) {
            sails.config.mockLogin = false;
            request(sails.hooks.http.app).get('/partials/fights').end(function(err, res) {
                res.statusCode.should.be.exactly(200);
                sails.config.mockLogin = true;
                done();
            });
        });
    });

    describe('#create()', function () {
        it('should be successful', function (done) {
            request(sails.hooks.http.app).get('/partials/fight/new').end(function(err, res) {
                res.statusCode.should.be.exactly(302);
                Fight.findOne({mj: 'test'}).exec(function(err, res) {
                    if (err) done(err);
                    res.groups.groupA.code.should.be.exactly('A');
                    res.groups.groupB.code.should.be.exactly('B');
                    res.time.hasStarted.should.be.false();
                    res.time.isFinished.should.be.false();
                    res.shortid.should.be.a.String();
                    done();
                });
            });
        });
    });

    describe('#show()', function () {
        it('should be successful as a gm', function (done) {
            Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                if (err) done(err);
                request(sails.hooks.http.app).get('/partials/fight/show/' + fight.shortid).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    res.text.indexOf(fight.shortid).should.not.be.eql(-1);
                    res.text.indexOf('MjCtrl').should.not.be.eql(-1);
                    done();
                });
            });
        });

        it('should be successful as a player', function (done) {
            Fight.update({mj: 'test'}, {mj: 'test2'}).exec(function(err, fights) {
                if (err) done(err);
                var fight = fights[0];
                request(sails.hooks.http.app).get('/partials/fight/show/' + fight.shortid).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    res.text.indexOf(fight.shortid).should.not.be.eql(-1);
                    res.text.indexOf('PjCtrl').should.not.be.eql(-1);
                    Fight.update({mj: 'test2'}, {mj: 'test'}).exec(done);
                });
            });
        });

        it('should not find nonexistent fights', function (done) {
            request(sails.hooks.http.app).get('/partials/fight/show/abcd').expect(404, done);
        });
    });

    describe('#save()', function () {
        it('should be successful', function (done) {
            var playersA = [fakePlayer('Test A', 'TA1', 'A')],
                playersB = [fakePlayer('Test B', 'TB1', 'B')];

            Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                fight.groups.groupA.players = playersA;
                fight.groups.groupB.players = playersB;
                request(sails.hooks.http.app).put('/fight/save').send({id: fight.id, data: fight}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                        fight.groups.groupA.players.length.should.be.eql(1);
                        fight.groups.groupB.players.length.should.be.eql(1);
                        done();
                    });
                });
            });
        });

        it('should detect missing data', function (done) {
            request(sails.hooks.http.app).put('/fight/save').send({id: undefined, data: undefined}).expect(500, done);
        });

        it('should restrict save operations to gm', function (done) {
            Fight.update({mj: 'test'}, {mj: 'test2'}).exec(function(err, results) {
                if (err) done(err);
                var fight = results[0];
                request(sails.hooks.http.app).put('/fight/save').send({id: fight.id, data: fight}).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Fight.update({mj: 'test2'}, {mj: 'test'}).exec(done);
                });
            });
        });
    });

    describe('#refresh()', function () {
        it('should be successful', function (done) {
            Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                fight.time.hasStarted.should.be.false();
                fight.time.actions.length.should.be.eql(0);
                fight.time.current.should.be.eql({});
                request(sails.hooks.http.app).post('/fight/refresh').send({id: fight.id}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                        fight.time.hasStarted.should.be.true();
                        fight.time.actions.length.should.be.eql(10);
                        fight.time.actions[0].source.fullName.should.startWith('Test');
                        fight.time.current.index.should.be.eql(1);
                        done();
                    });
                });
            });
        });

        it('should be successful to reset', function (done) {
            Fight.update({mj: 'test'}, {'time.current.index': 2}).exec(function(err, fight) {
                request(sails.hooks.http.app).post('/fight/refresh').send({id: fight[0].id}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Fight.update({mj: 'test'}, {'time.current.index': 1}).exec(function(err, fights) {
                        var fight = fights[0];
                        fight.time.hasStarted.should.be.true();
                        fight.time.actions.length.should.be.eql(13);
                        fight.time.actions[0].source.fullName.should.startWith('Test');
                        done();
                    });
                });
            });
        });

        it('should detect missing information', function (done) {
            request(sails.hooks.http.app).post('/fight/refresh').send({id: undefined}).expect(500, done);
        });

        it('should restrict refresh operations to gm', function (done) {
            Fight.update({mj: 'test'}, {mj: 'test2'}).exec(function(err, results) {
                if (err) done(err);
                var fight = results[0];
                request(sails.hooks.http.app).post('/fight/refresh').send({id: fight.id}).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Fight.update({mj: 'test2'}, {mj: 'test'}).exec(done);
                });
            });
        });

        it('should not refresh finished fights', function (done) {
            Fight.update({mj: 'test'}, {'time.isFinished': true}).exec(function(err, results) {
                if (err) done(err);
                var fight = results[0];
                request(sails.hooks.http.app).post('/fight/refresh').send({id: fight.id}).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Fight.update({mj: 'test'}, {'time.isFinished': false}).exec(done);
                });
            });
        });

        it('should detect nonexistent fights', function (done) {
            request(sails.hooks.http.app).post('/fight/refresh').send({id: 'abc'}).expect(404, done);
        });
    });

    describe('#roll()', function () {
        it('should be successful', function (done) {
            Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                var action = {desc: 'Test', archetype: 'PNJ', type: 'offense',
                        target: fight.groups.groupB.players[0], source: fight.groups.groupA.players[0]},
                    index = fight.time.actions.length - fight.time.current.index;

                should.not.exist(fight.time.actions[index].desc);
                should.not.exist(fight.time.actions[index].archetype);
                should.not.exist(fight.time.actions[index].type);
                should.not.exist(fight.time.actions[index].target);
                should.not.exist(fight.time.actions[index].roll);
                should.exist(fight.time.actions[index].source.archetypes);
                fight.time.current.index.should.be.eql(1);

                request(sails.hooks.http.app).post('/fight/roll').send({id: fight.id, action: action}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                        fight.time.current.index.should.be.eql(2);
                        fight.time.actions[index].desc.should.be.eql(action.desc);
                        fight.time.actions[index].archetype.should.be.eql(action.archetype);
                        fight.time.actions[index].type.should.be.eql(action.type);
                        fight.time.actions[index].target.should.be.eql(action.target);
                        fight.time.actions[index].roll.should.be.above(40);
                        fight.time.actions[index].roll.should.be.below(100);
                        done();
                    });
                });
            });
        });

        it('should detect missing information', function (done) {
            request(sails.hooks.http.app).post('/fight/roll').send({id: undefined, action: undefined}).expect(500, done);
        });

        it('should restrict rolls to gm', function (done) {
            Fight.update({mj: 'test'}, {mj: 'test2'}).exec(function(err, results) {
                if (err) done(err);
                var fight = results[0];
                request(sails.hooks.http.app).post('/fight/roll').send({id: fight.id, action: {}}).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Fight.update({mj: 'test2'}, {mj: 'test'}).exec(done);
                });
            });
        });

        it('should not authorize to roll in finished fights', function (done) {
            Fight.update({mj: 'test'}, {'time.isFinished': true}).exec(function(err, results) {
                if (err) done(err);
                var fight = results[0];
                request(sails.hooks.http.app).post('/fight/roll').send({id: fight.id, action: {}}).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Fight.update({mj: 'test'}, {'time.isFinished': false}).exec(done);
                });
            });
        });

        it('should detect nonexistent fights', function (done) {
            request(sails.hooks.http.app).post('/fight/roll').send({id: 'abc', action: {}}).expect(404, done);
        });

        it('should automatically refresh actions', function (done) {
            Fight.update({mj: 'test'}, {'time.actions': [{roll: 20}, {}]}).exec(function(err, fights) {
                var fight = fights[0],
                    action = {desc: 'Test', archetype: 'PNJ', type: 'offense',
                        target: fight.groups.groupB.players[0], source: fight.groups.groupA.players[0]};

                fight.time.actions.length.should.be.eql(2);
                request(sails.hooks.http.app).post('/fight/roll').send({id: fight.id, action: action}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                        fight.time.actions.length.should.be.eql(12);
                        done();
                    });
                });
            });
        });
    });

    describe('#apiGet()', function () {
        it('should be successful', function (done) {
            Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                if (err) done(err);
                request(sails.hooks.http.app).get('/api/fight/' + fight.id).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    res.body.mj.should.be.eql('test');
                    res.body.groups.groupA.players.length.should.be.eql(1);
                    done();
                });
            });
        });

        it('should not return nonexistent fights', function (done) {
            request(sails.hooks.http.app).get('/api/fight/abcd').expect(404, done);
        });
    });

    describe('#end()', function () {
        it('should not delete the fight', function (done) {
            Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                fight.time.hasStarted.should.be.true();
                fight.time.isFinished.should.be.false();
                request(sails.hooks.http.app).post('/fight/end/').send({id: fight.id}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Fight.findOne({mj: 'test'}).exec(function(err, fight) {
                        fight.time.isFinished.should.be.true();
                        done();
                    });
                });
            });
        });

        it('should restrict end operations to gm', function (done) {
            Fight.update({mj: 'test'}, {mj: 'test2'}).exec(function(err, results) {
                if (err) done(err);
                var fight = results[0];
                request(sails.hooks.http.app).post('/fight/end/').send({id: fight.id}).end(function(err, res) {
                    res.statusCode.should.be.exactly(403);
                    Fight.update({mj: 'test2'}, {mj: 'test'}).exec(done);
                });
            });
        });

        it('should delete the fight', function (done) {
            Fight.update({mj: 'test'}, {'time.isFinished': false, 'time.hasStarted': false}).exec(function(err, fights) {
                var fight = fights[0];
                fight.time.hasStarted.should.be.false();
                fight.time.isFinished.should.be.false();
                request(sails.hooks.http.app).post('/fight/end/').send({id: fight.id}).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    Fight.find({mj: 'test'}).exec(function(err, fights) {
                        fights.length.should.be.eql(0);
                        done();
                    });
                });
            });
        });
    });

    var fakePlayer = function(name, trigram, groupCode) {
        return {
            firstName: name, lastName: name, fullName: name, trigram: trigram,
            archetypes: {PNJ: 5}, active: true, group: groupCode, fightType: 'offense'
        };
    };
});