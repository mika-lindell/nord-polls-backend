/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


const shortid = require('shortid');

module.exports = {

  /**
   * Create new poll and save it to database.
   *
   * @return {object} Sails ServerResponse containing the poll which was added to database or error message in case of error.
   */
  create(req, res) {

    Poll.create(req.body).then((poll)=> {

      req.body.choices.map((current)=> { 

        const newChoice = {
          label: current,
          poll: poll.id
        };

        Choice.create(newChoice).then((choice)=> {}, (err)=> {
          return res.send(400, {
            error: 'Failed to save poll choices :('
          });         
        });
      });

      Poll.findOne(poll.id).populateAll().then((err, choices)=> {
        const result = {
          data: Object.assign({}, poll, choices)
        }; 
        return res.send(result);
      });

    }, (err)=> {
      return res.send(400, {
        error: 'Failed to save the poll :('
      });
    });
  },

  read(req, res) {
    return res.send('Read');
  },

  update(req, res) {
    return res.send('Update');
  } 
};

