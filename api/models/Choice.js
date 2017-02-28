/**
 * Choice.js
 *
 * @description :: A single choice in a Poll
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const shortid = require('shortid');

module.exports = {
  attributes: {
    id: {
      type: 'string',
      defaultsTo: shortid.generate(),
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

