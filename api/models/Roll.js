/**
 * Roll.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        score: { type: 'integer', required: true },
        faces: { type: 'integer', required: true },
        action: { type: 'string', required: true, size: 255 }
    }

};

