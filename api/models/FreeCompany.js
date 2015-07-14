/**
 * FreeCompany.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: { type: 'string', required: true, size: 24 },
        desc: { type: 'string', required: true, size: 5000 },
        tag: { type: 'string', required: true, size: 5 },
        server: { type: 'string', required: true, size: 24 },
        url: { type: 'string', required: true, size: 255 },
        isRecruiting: { type: 'boolean', required: true },
        startDate: { type: 'date', required: true },
        address: { type: 'json' },
        icon: { type: 'string', required: true, size: 128 },
        realPlayersCount: { type: 'integer', defaultsTo: 0 },

        users: { type: 'array' },
        founders: { collection: 'character', via: 'leadership' },
        members: { collection: 'character', via: 'membership' }
    },

    getPlayersCount: function(founders, members, callback) {
        var characters = [], users = [];
        characters = characters.concat(founders);
        characters = characters.concat(members);

        if (characters.length == 0) callback(null, 0);
        else if (characters[0].user) {
            // We have the actual objects, so we just need to count distinct users.
            for (var i = 0; i < characters.length; i++) {
                if (users.indexOf(characters[i].user) == -1 && !characters[i].isInvited) {
                    users.push(characters[i].user);
                }
            }
            callback(null, users.length);
        } else {
            // We only have IDs, so we need to query the database to get the whole objects.
            // Then we count the distinct users.
            Character.find().where({id: characters}).exec(function (err, results) {
                for (var i = 0; i < results.length; i++) {
                    if (users.indexOf(results[i].user) == -1 && !results[i].isInvited) {
                        users.push(results[i].user);
                    }
                }
                callback(null, users.length);
            });
        }
    },

    getUsers: function(founders, callback) {
        var users = [];
        if (founders.length == 0) {
            // We won't unset the users list, to prevent the company to be un-editable.
            callback(null, users);
        } else if (founders[0].user) {
            // We have actual objets, so we get the distinct users.
            for (var i = 0; i < valuesToUpdate.founders.length; i++) {
                if (users.indexOf(valuesToUpdate.founders[i].user) == -1) {
                    users.push(valuesToUpdate.founders[i].user);
                }
            }
            callback(null, users);
        } else {
            // We only have IDs, so we need to query the dabatase to get the whole objects.
            // Then we get the distinct users.
            Character.find().where({id: founders}).exec(function (err, results) {
                for (var i = 0; i < results.length; i++) {
                    if (users.indexOf(results[i].user) == -1) {
                        users.push(results[i].user);
                    }
                }
                callback(null, users);
            });
        }
    },

    updatePlayersCount: function(id, cb) {
        FreeCompany.findOne({id: id}).exec(function(err, result) {
            async.parallel({
                // We update the *real* players count. i.e. rerolls are ignored.
                playersCount: function(callback) {
                    FreeCompany.getPlayersCount(result.founders, result.members, callback);
                },

                // Updates the 'users' list. It consists of the users that are authorized to edit the free company.
                users: function(callback) {
                    FreeCompany.getUsers(result.founders, callback);
                }
            }, function(err, data) {
                FreeCompany.update({id: id}, {users: data.users, realPlayersCount: data.playersCount}).exec(function(err, result) {
                    if (err) return cb(err);
                    else return cb(null, data.playersCount);
                });
            });
        });
    }
};

