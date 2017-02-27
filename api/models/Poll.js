/**
 * Poll.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
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

