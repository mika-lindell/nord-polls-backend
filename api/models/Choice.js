/**
 * Choice.js
 *
 * @description :: A single choice in a Poll
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'string',
      index: true,
      primaryKey: true,
      unique: true,
      required: true,     
    },
    title: {
      type: 'string'
    },
    votes: {
      type: 'integer',
      defaultsTo: 0
    },
    poll: {
      model: 'poll'
    }
  }
};

