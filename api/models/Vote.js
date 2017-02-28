/**
 * Vote.js
 *
 * @description :: Votes for a choice.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    choice_id: {
      type: 'string',
      index: true,
      primaryKey: true,
      unique: true,
      required: true,       
    },
    votes: {
      type: 'integer',
      defaultsTo: 0
    },    
  }
};

