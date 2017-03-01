/**
 * Poll.js
 *
 * @description :: A poll containing many Choices
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'string',
      index: true,
      primaryKey: true,
      unique: true,
      required: true    
    },
    title: {
      type: 'string'
    },
    choices: {
      collection: 'choice',
      via: 'poll'
    }
  }
};

