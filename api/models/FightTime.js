/**
 * FightTime.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

    attributes: {
        current: { type: 'json' },
        actions: { type: 'array' },
        hasStarted: { type: 'boolean', required: true },
        isFinished: { type: 'boolean', required: true },
    }
};

