/**
* God.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      name: { type: 'string', required: true, size: 24 },
      desc: { type: 'string', required: true, size: 64 },
      element: { type: 'string', required: true, size: 24 }
  }
};