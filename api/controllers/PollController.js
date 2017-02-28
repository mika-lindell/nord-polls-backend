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
    const newPoll = Object.assign({
        id: shortid.generate()
      }, req.body);    
    Poll.create(newPoll).then((poll)=> {
      if(typeof poll === 'undefined'){
        return res.send(400, {
          error: 'The poll you are looking for seems to be missing.'
        });
      }
      req.body.choices.map((current)=> { 
        const newChoice = {
          id: shortid.generate(),
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
        error: 'It seems that your website address is missing the id of the poll.'
      });
    }

    Poll.findOne(id).then((poll)=> {
      if(typeof poll === 'undefined'){
        return res.send(404, {
          error: 'The poll you are looking for seems to be missing.'
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
  /**
   * Add 1 vote to a choice. /poll/:id/vote
   *
   * @return {integer} Sails ServerResponse containing the updated choice or error message in case of error.
   */
  vote(req, res) {
    const pollID = req.param('id');

    if(typeof req.body.choice_id === 'undefined'){
      return res.send(400, {
        error: 'Cant\'t find out which choice you wanted to vote.'
      });
    }

    Choice.findOne(req.body.choice_id).then((choice)=> {
      if(typeof choice === 'undefined'){
        return res.send(404, {
          error: 'The choice you wanted to vote seems to be missing.'
        });
      }

      const update = {
        votes: choice.votes + 1
      }; 

      Choice.update({id: req.body.choice_id}, update).then((choice)=> {
       return res.send({
          data: choice
        }); 
      }, (err)=> {
        return res.send(400, {
          error: 'Failed to save the vote :('
        });
      });
    }, (err)=> {
      return res.send(400, {
        error: 'Failed to save the vote :('
      });
    });
  }
};

