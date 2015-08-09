/**
 * ChatMsg.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        username: { type: 'string', required: true, size: 50 },
        text: { type: 'string', required: true, size: 2048 },
        avatar: { type: 'string', required: true }
    }

};

