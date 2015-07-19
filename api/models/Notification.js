/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        type: { type: 'string', enum: ['fc-invite'], required: true },
        data: { type: 'json', required: true },
        target: { model: 'user', required: true }
    }
};

