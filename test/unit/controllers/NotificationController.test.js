var request = require('supertest'),
    should = require('should');

describe('NotificationController', function() {

    var character = {
        firstName: 'Test', lastName: 'Test', trigram: 'TES', sex: 'F', archetypes: {BLM: 5},
        crafts: {}, harvesters: {}, fightType: 'offense', avatar: 'default.png', tribe: 'test',
        moral: 20, ethics: 40, language: 'en', server: 'Moogle',
        race: {name: 'test', lifespan: 10, tribes: ['test']}, god: {name: 'test', desc: 'test', element: 'test'},
        birthPlace: {name: 'test', region: 'test'}, user: 'test', fullName: 'Test Test'
    },
        freeCompany = {
        desc: 'Test', name: 'Test', tag: 'TES', server: 'Moogle', url: 'test', icon: 'default.png',
        isRecruiting: true, address: {}, founders: [], members: [], users: ['test']
    };

    describe('#list()', function () {
        before(function(done) {
            Notification.destroy({target: 'test'}).exec(done);
        });

        it('should return an empty array', function (done) {
            request(sails.hooks.http.app).get('/notifications').expect([], done);
        });

        it('should return one notification', function (done) {
            async.parallel({
                character: function(callback) {
                    Character.create(character).exec(callback);
                },
                freeCompany: function(callback) {
                    FreeCompany.create(freeCompany).exec(callback);
                }
            }, function(err, data) {
                var params = {freeCompany: data.freeCompany.id, member: data.character.id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    request(sails.hooks.http.app).get('/notifications').end(function(err, res) {
                        res.statusCode.should.be.exactly(200);
                        res.body.length.should.be.eql(1);
                        res.body[0].type.should.be.eql('fc-invite');
                        done();
                    });
                });
            });
        });
    });

    describe('#accept()', function () {
        beforeEach(function(done) {
            async.series({
                dropChars: function(callback) {
                    Character.destroy({}).exec(callback);
                },
                dropCompanies: function(callback) {
                    FreeCompany.destroy({}).exec(callback);
                },
                dropNotifs: function(callback) {
                    Notification.destroy({}).exec(callback);
                },
                character: function(callback) {
                    Character.create(character).exec(callback);
                },
                freeCompany: function(callback) {
                    FreeCompany.create(freeCompany).exec(callback);
                }
            }, function(err, data) {
                var params = {freeCompany: data.freeCompany.id, member: data.character.id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).end(function(err, res) {
                    request(sails.hooks.http.app).get('/notifications').end(done);
                });
            });
        });

        it('should be successful (member)', function (done) {
            Notification.findOne({target: 'test'}).exec(function(err, notif) {
                request(sails.hooks.http.app).get('/notification/' + notif.id + '/accept').end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    async.parallel({
                        character: function(callback) {
                            Character.findOne({user: notif.target}).exec(callback);
                        },
                        notification: function(callback) {
                            Notification.find({id: notif.id}).exec(callback);
                        },
                        company: function(callback) {
                            FreeCompany.findOne({id: notif.data.freeCompany.id}).populateAll().exec(callback);
                        }
                    }, function(err, data) {
                        if (err) done(err);
                        data.character.isInvited.should.be.false();
                        data.character.membership.should.be.eql(data.company.id);
                        data.company.members.length.should.be.eql(1);
                        data.company.realPlayersCount.should.be.eql(1);
                        data.notification.length.should.be.eql(0);
                        done();
                    });
                });
            });
        });

        it('should restrict access to the target', function (done) {
            Notification.update({target: 'test'}, {target: 'test2'}).exec(function(err, notif) {
                request(sails.hooks.http.app).get('/notification/' + notif[0].id + '/accept').expect(403, done);
            });
        });

        it('should detect nonexistent notification', function (done) {
            request(sails.hooks.http.app).get('/notification/abc/accept').expect(404, done);
        });

        it('should detect invalid notification type', function (done) {
            Notification.update({}, {type: 'test'}).exec(function(err, notif) {
                should.exist(err);
                done();
            });
        });
    });

    describe('#decline()', function () {
        beforeEach(function(done) {
            async.series({
                dropChars: function(callback) {
                    Character.destroy({}).exec(callback);
                },
                dropCompanies: function(callback) {
                    FreeCompany.destroy({}).exec(callback);
                },
                dropNotifs: function(callback) {
                    Notification.destroy({}).exec(callback);
                },
                character: function(callback) {
                    Character.create(character).exec(callback);
                },
                freeCompany: function(callback) {
                    FreeCompany.create(freeCompany).exec(callback);
                }
            }, function(err, data) {
                var params = {freeCompany: data.freeCompany.id, member: data.character.id, isFounder: false};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).end(function(err, res) {
                    request(sails.hooks.http.app).get('/notifications').end(done);
                });
            });
        });

        it('should be successful (member)', function (done) {
            Notification.findOne({target: 'test'}).exec(function(err, notif) {
                request(sails.hooks.http.app).get('/notification/' + notif.id + '/decline').end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    async.parallel({
                        character: function(callback) {
                            Character.findOne({user: notif.target}).exec(callback);
                        },
                        notification: function(callback) {
                            Notification.find({id: notif.id}).exec(callback);
                        },
                        company: function(callback) {
                            FreeCompany.findOne({id: notif.data.freeCompany.id}).populateAll().exec(callback);
                        }
                    }, function(err, data) {
                        if (err) done(err);
                        data.character.isInvited.should.be.false();
                        should.not.exist(data.character.membership);
                        data.company.members.length.should.be.eql(0);
                        data.company.realPlayersCount.should.be.eql(0);
                        data.notification.length.should.be.eql(0);
                        done();
                    });
                });
            });
        });

        it('should restrict access to the target', function (done) {
            Notification.update({target: 'test'}, {target: 'test2'}).exec(function(err, notif) {
                request(sails.hooks.http.app).get('/notification/' + notif[0].id + '/decline').expect(403, done);
            });
        });

        it('should detect nonexistent notification', function (done) {
            request(sails.hooks.http.app).get('/notification/abc/decline').expect(404, done);
        });
    });

    describe('#decline() & #accept() — founder', function () {
        beforeEach(function(done) {
            async.series({
                dropChars: function(callback) {
                    Character.destroy({}).exec(callback);
                },
                dropCompanies: function(callback) {
                    FreeCompany.destroy({}).exec(callback);
                },
                dropNotifs: function(callback) {
                    Notification.destroy({}).exec(callback);
                },
                character: function(callback) {
                    Character.create(character).exec(callback);
                },
                freeCompany: function(callback) {
                    FreeCompany.create(freeCompany).exec(callback);
                }
            }, function(err, data) {
                var params = {freeCompany: data.freeCompany.id, member: data.character.id, isFounder: true};
                request(sails.hooks.http.app).post('/free-company/invite').send(params).end(function(err, res) {
                    request(sails.hooks.http.app).get('/notifications').end(done);
                });
            });
        });

        it('should be successful (accept founder)', function (done) {
            Notification.findOne({target: 'test'}).exec(function(err, notif) {
                request(sails.hooks.http.app).get('/notification/' + notif.id + '/accept').end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    async.parallel({
                        character: function(callback) {
                            Character.findOne({user: notif.target}).exec(callback);
                        },
                        notification: function(callback) {
                            Notification.find({id: notif.id}).exec(callback);
                        },
                        company: function(callback) {
                            FreeCompany.findOne({id: notif.data.freeCompany.id}).populateAll().exec(callback);
                        }
                    }, function(err, data) {
                        if (err) done(err);
                        data.character.isInvited.should.be.false();
                        data.character.leadership.should.be.eql(data.company.id);
                        data.company.founders.length.should.be.eql(1);
                        data.company.users.length.should.be.eql(1);
                        data.company.users.should.containEql(data.character.user);
                        data.company.realPlayersCount.should.be.eql(1);
                        data.notification.length.should.be.eql(0);
                        done();
                    });
                });
            });
        });

        it('should be successful (decline founder)', function (done) {
            Notification.findOne({target: 'test'}).exec(function(err, notif) {
                request(sails.hooks.http.app).get('/notification/' + notif.id + '/decline').end(function(err, res) {
                    res.statusCode.should.be.exactly(200);
                    async.parallel({
                        character: function(callback) {
                            Character.findOne({user: notif.target}).exec(callback);
                        },
                        notification: function(callback) {
                            Notification.find({id: notif.id}).exec(callback);
                        },
                        company: function(callback) {
                            FreeCompany.findOne({id: notif.data.freeCompany.id}).exec(callback);
                        }
                    }, function(err, data) {
                        if (err) done(err);
                        data.character.isInvited.should.be.false();
                        should.not.exist(data.character.leadership);
                        data.company.founders.length.should.be.eql(0);
                        data.company.users.length.should.be.eql(1);
                        data.company.realPlayersCount.should.be.eql(0);
                        data.notification.length.should.be.eql(0);
                        done();
                    });
                });
            });
        });
    });

});