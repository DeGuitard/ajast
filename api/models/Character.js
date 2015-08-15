/**
 * Character.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        firstName: { type: 'string', required: true, size: 24 },
        lastName: { type: 'string', required: true, size: 24 },
        fullName: { type: 'string', required: true, size: 50 },
        trigram: { type: 'string', required: true, size: 3 },
        sex: { type: 'string', required: true, size: 1 },
        age: { type: 'integer' },
        archetypes: { type: 'json', required: true },
        crafts: { type: 'json', required: true },
        harvesters: { type: 'json', required: true },
        fightType: { type: 'string', required: true},
        avatar: { type: 'string', required: true },
        initiative: { type: 'integer' },
        timeline: {type: 'array' },
        tribe: {type: 'string', required: true, size: 24 },
        isInvited: { type: 'boolean' },
        moral: { type: 'integer', required: true },
        ethics: { type: 'integer', required: true },
        language: { type: 'string', required: true, size: 2 },
        server: { type: 'string', required: true, size: 24 },
        physDesc: { type: 'string', required: true, size: 4000 },
        mentDesc: { type: 'string', required: true, size: 4000 },

        race: { model: 'race', required: true },
        god: { model: 'god', required: true },
        birthPlace: { model: 'town', required: true },
        user: { model: 'user', required: true },
        membership: { model: 'freeCompany' },
        leadership: { model: 'freeCompany' }
    },

    afterValidate: function (values, next) {
        var score = 0,
            errOP = new Error('Ce personnage est surcompétent.');

        for (var i in values.archetypes) {
            if (values.archetypes[i] == 5) score += 6;
            else score += values.archetypes[i];
        }

        if (score > 6) next(errOP);
        else next();
    }
};

