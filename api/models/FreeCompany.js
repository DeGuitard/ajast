/**
 * FreeCompany.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: { type: 'string', required: true, size: 24 },
        desc: { type: 'string', required: true, size: 2500 },
        tag: { type: 'string', required: true, size: 5 },
        address: { type: 'json' },
        website: { type: 'string', required: true, size: 255 },
        isRecruiting: { type: 'boolean', required: true },
        startDate: { type: 'date', required: true },

        users: { type: 'array', required: true },
        founders: { collection: 'character', via: 'leadership' },
        members: { collection: 'character', via: 'membership' }
    }
};

