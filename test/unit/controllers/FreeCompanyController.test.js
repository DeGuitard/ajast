var request = require('supertest');

describe('FreeCompanyController', function() {

    var character = {
            firstName: 'Test', lastName: 'Test', trigram: 'TES', sex: 'F', archetypes: {BLM: 5},
            crafts: {}, harvesters: {}, fightType: 'offense', avatar: 'default.png', tribe: 'test',
            moral: 20, ethics: 40, language: 'en', server: 'Moogle',
            race: {name: 'test', lifespan: 10, tribes: ['test']}, god: {name: 'test', desc: 'test', element: 'test'},
            birthPlace: {name: 'test', region: 'test'}, user: {}, fullName: 'Test Test'
    };

    describe('#list()', function() {
        it('should be successful', function(done) {
            request(sails.hooks.http.app).get('/free-companies').expect(200).end(done);
        });
    });

    describe('#new()', function() {
        it('should be successful', function(done) {
            request(sails.hooks.http.app).get('/free-company/new').expect(200).end(done);
        });
    });

    describe('#save()', function() {
        it('should insert data', function(done) {
            var newFc = {
                freeCompany: {
                    desc: 'Test', name: 'Test', tag: 'TES', server: 'Moogle', url: 'test', icon: 'default.png',
                    isRecruiting: true, address: {}, founders: [], members: [], users: ['test']
                }
            };
            request(sails.hooks.http.app).post('/free-company/save').send(newFc).expect(200).end(function() {
                FreeCompany.find().exec(function(err, fcs) {
                    fcs.length.should.be.exactly(1);
                    var fc = fcs[0];
                    fc.desc.should.be.exactly(newFc.freeCompany.desc);
                    fc.name.should.be.exactly(newFc.freeCompany.name);
                    fc.tag.should.be.exactly(newFc.freeCompany.tag);
                    fc.server.should.be.exactly(newFc.freeCompany.server);
                    fc.url.should.be.exactly(newFc.freeCompany.url);
                    fc.icon.should.be.exactly(newFc.freeCompany.icon);
                    fc.isRecruiting.should.be.exactly(newFc.freeCompany.isRecruiting);
                    fc.address.should.be.eql(newFc.freeCompany.address);
                    fc.founders.length.should.be.eql(newFc.freeCompany.founders.length);
                    fc.members.length.should.be.eql(newFc.freeCompany.members.length);
                    done();
                });
            });
        });

        it('should update existing data', function(done) {
            FreeCompany.find().populate('founders').populate('members').limit(1).exec(function (err, result) {
                if (err) return done(err);
                result[0].name = 'Test 2';
                request(sails.hooks.http.app).post('/free-company/save').send({freeCompany: result[0]}).expect(200).end(function () {
                    FreeCompany.find().exec(function (err, fcs) {
                        fcs.length.should.be.exactly(1);
                        fcs[0].name.should.be.exactly(result[0].name);
                        done();
                    });
                });
            });
        });

        it('should detect double', function(done) {
            var newFc = {
                freeCompany: {
                    desc: 'Test', name: 'Test 2', tag: 'TES', server: 'Moogle', url: 'test', icon: 'default.png',
                    isRecruiting: true, address: {}, founders: [], members: [], users: ['test']
                }
            };
            request(sails.hooks.http.app).post('/free-company/save').send(newFc).expect(500).end(function () {
                FreeCompany.find().exec(function (err, fcs) {
                    fcs.length.should.be.exactly(1);
                    done();
                });
            });
        });

        it('should be detect missing fields', function(done) {
            var newFc = {
                freeCompany: {
                    desc: 'Test', tag: 'TES', server: 'Moogle', url: 'test', icon: 'default',
                    isRecruiting: true, address: {}, founders: [], members: [], users: ['test']
                }
            };
            request(sails.hooks.http.app).post('/free-company/save').send(newFc).expect(500).end(function () {
                FreeCompany.find().exec(function (err, fcs) {
                    fcs.length.should.be.exactly(1);
                    done();
                });
            });
        });
    });

    describe('#show()', function() {
        it('should be successful', function(done) {
            FreeCompany.find().limit(1).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/free-company/show/' + result[0].name).expect(200).end(done);
            });
        });

        it('should not find nonexistent free companies', function(done) {
            request(sails.hooks.http.app).get('/free-company/show/abc').expect(404).end(done);
        });
    });

    describe('#edit()', function() {
        it('should be successful', function(done) {
            FreeCompany.find().limit(1).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/free-company/edit/' + result[0].id).expect(200).end(done);
            });
        });

        it('should not authorize to edit nonexistent free companies', function(done) {
            request(sails.hooks.http.app).get('/free-company/edit/abc').expect(404).end(done);
        });

        it('should restrict edit access to founders', function(done) {
            FreeCompany.update({}, {users: ['abc']}).exec(function (err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).get('/free-company/edit/' + result[0].id).expect(403).end(function() {
                    FreeCompany.update({}, {users: ['test']}).exec(done);
                });
            });
        });
    });

    describe('#invite()', function() {
        before(function(done) {
            Character.create(character).exec(function(err, result) {
                if (err) done(err);
                else done();
            });
        }),

        it('should be successful', function(done) {
            async.parallel({
                freeCompany: function(callback) {
                    FreeCompany.find().limit(1).exec(callback);
                },
                character: function(callback) {
                    Character.find().limit(1).exec(callback);
                }
            }, function(err, data) {
                if (err) done(err);
                var params = {freeCompany: data.freeCompany[0].id, member: data.character[0].id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).expect(200).end(function() {
                    async.parallel({
                        freeCompany: function(callback) {
                            FreeCompany.findOne({id: data.freeCompany[0].id}).exec(callback);
                        },
                        character: function(callback) {
                            Character.findOne({id: data.character[0].id}).exec(callback);
                        },
                        notification: function(callback) {
                            Notification.find().limit(1).exec(callback);
                        }
                    }, function(err, data) {
                        data.freeCompany.members.length.should.be.exactly(1);
                        data.character.isInvited.should.be.exactly(true);
                        data.notification[0].type.should.be.exactly('fc-invite');
                        data.notification[0].target.should.be.eql(data.character.user);
                        data.notification[0].data.freeCompany.id.should.be.exactly(data.freeCompany.id);
                        data.notification[0].data.character.id.should.be.exactly(data.character.id);
                        done();
                    });
                });
            });
        });

        it('should ask to save free company at least once before', function(done) {
            async.parallel({
                character: function(callback) {
                    Character.find().limit(1).exec(callback);
                }
            }, function(err, data) {
                if (err) done(err);
                var params = {freeCompany: undefined, member: data.character[0].id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).expect(500).end(function(err, res) {
                    res.error.text.should.be.exactly('fc.notices.saveOnce');
                    done();
                });
            });
        });

        it('should detect unknown free company', function(done) {
            async.parallel({
                character: function(callback) {
                    Character.find().limit(1).exec(callback);
                }
            }, function(err, data) {
                if (err) done(err);
                var params = {freeCompany: 'abc', member: data.character[0].id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).expect(404).end(done);
            });
        });

        it('should detect unknown character', function(done) {
            async.parallel({
                freeCompany: function(callback) {
                    FreeCompany.find().limit(1).exec(callback);
                }
            }, function(err, data) {
                if (err) done(err);
                var params = {freeCompany: data.freeCompany[0].id, member: 'abc', isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).expect(404).end(done);
            });
        });

        it('should detect pending invitations', function(done) {
            async.parallel({
                freeCompany: function(callback) {
                    FreeCompany.find().limit(1).exec(callback);
                },
                character: function(callback) {
                    Character.update({}, {isInvited: true, membership: undefined, leadership: undefined}).exec(callback);
                }
            }, function(err, data) {
                if (err) done(err);
                var params = {freeCompany: data.freeCompany[0].id, member: data.character[0].id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).expect(500).end(function(err, res) {
                    res.error.text.should.be.exactly('fc.notices.alreadyInvited');
                    done();
                });
            });
        });

        it('should detect players already inside a free company', function(done) {
            async.parallel({
                freeCompany: function(callback) {
                    FreeCompany.find().limit(1).exec(callback);
                },
                character: function(callback) {
                    Character.update({}, {isInvited: false, membership: 'abc', leadership: undefined}).exec(callback);
                }
            }, function(err, data) {
                if (err) done(err);
                var params = {freeCompany: data.freeCompany[0].id, member: data.character[0].id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).expect(500).end(function(err, res) {
                    res.error.text.should.be.exactly('fc.notices.alreadyInside');
                    done();
                });
            });
        });

        it('should forbid access to unauthorized users', function(done) {
            async.parallel({
                freeCompany: function(callback) {
                    FreeCompany.update({}, {users: ['abc']}).exec(callback);
                },
                character: function(callback) {
                    Character.update({}, {isInvited: false, membership: undefined, leadership: undefined}).exec(callback);
                }
            }, function(err, data) {
                if (err) done(err);
                var params = {freeCompany: data.freeCompany[0].id, member: data.character[0].id, isFounder: true};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).expect(403).end(function() {
                    FreeCompany.update({}, {users: ['test']}).exec(done);
                });
            });
        });
    });

    describe('#remove()', function() {
        it('should be successful', function(done) {
            FreeCompany.find().limit(1).exec(function(err, result) {
                if (err) return done(err);
                request(sails.hooks.http.app).delete('/free-company/remove/' + result[0].id).expect(200).end(function () {
                    FreeCompany.find().exec(function (err, fcs) {
                        fcs.length.should.be.exactly(0);
                        done();
                    });
                });
            });
        });
    });
});