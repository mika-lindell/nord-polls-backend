/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


const shortid = require('shortid');

module.exports = {
  /**
   * Create new poll and save it to database. /poll/
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
        Choice.create(newChoice).then((choice)=>{}, (err)=> {
          return res.send(400, {
            error: 'Failed to save poll choices :('
          });         
        });
      });
      Poll.findOne(poll.id).populateAll().then((choices)=> {
        const result = {
          data: Object.assign({}, poll, choices)
        }; 
        return res.send(result);
      }, (err)=> {
        return res.send(400, {
          error: 'Failed to save the poll :('
        });
      });
    }, (err)=> {
      return res.send(400, {
        error: 'Failed to save the poll :('
      });
    });
  },
  /**
   * Get existing poll. /poll/:id
   *
   * @return {object} Sails ServerResponse containing the poll which was requested.
   */
  read(req, res) {
    const id = req.param('id');

    if(typeof id === 'undefined'){
      return res.send(400, {
        error: 'Could not find the poll, sorry.'
      });
    }

    Poll.findOne(id).then((poll)=> {
      if(typeof poll === 'undefined'){
        return res.send(404, {
          error: 'Could not find the poll, sorry.'
        });
      }
      Poll.findOne(id).populateAll().then((choices)=> {
        const result = {
          data: Object.assign({}, poll, choices)
        }; 
        return res.send(result);
      }, (err)=> {
        return res.send(400, {
          error: 'Failed to find the poll :('
        });
      });
    });
  },
  update(req, res) {
    return res.send('Update');
  } 
};

