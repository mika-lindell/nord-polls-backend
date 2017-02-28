/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


const shortid = require('shortid');

module.exports = {

	create: function (req, res) {

		sails.log.debug('-- CREATE POLL --');
		sails.log.debug('Payload:');
		sails.log.debug(req.body);

		Poll.create(req.body).exec((err, poll) => {
			
			sails.log.debug('Poll:');
			sails.log.debug(poll);

			if(err) return res.send({
				status: 'error',
				error: 'Failed to save the poll :('
			});

			req.body.choices.forEach((current)=>{

				let choice = {
					label: current,
					poll: poll.id
				};

				Choice.create(choice).exec((err, choice) => {
					sails.log.debug('Choice:');
					sails.log.debug(choice);
					if(err) return res.send({
						status: 'error',
						error: 'Failed to save poll choices :('
					});
				});
			});

			Poll.findOne(poll.id).populateAll().exec((err, choices)=>{
				const result = {
					status: 'success',
					data: Object.assign({}, poll, choices)
				} 
				return res.send(result);
			});

		});



		// Poll.find({id:1}).exec(function (err, records){
		// 	console.log(records);
		// });
	},

	read: function (req, res) {
	  return res.send('Read');
	},

	update: function (req, res) {
	  return res.send('Update');
	}	
};

