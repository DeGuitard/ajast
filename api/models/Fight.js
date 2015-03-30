/**
 * Fight.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var randomWord = require('random-word');

module.exports = {

    attributes: {

    },

    beforeCreate: function(values, cb) {
        values.shortid = randomWord();
        cb();
    }
};

