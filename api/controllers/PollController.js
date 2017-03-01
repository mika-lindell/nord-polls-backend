/**
 * PollController
 *
 * @description :: Server-side logic for managing polls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const shortid = require('shortid');

/**
 * Get existing poll.
 *
 * @param {string} The id of the poll to be queried
 * @param  {object} Sails response
 * @param {object} Sails request
 * @param {boolean} Include votes in response if true
 *
 * @return {object} Sails ServerResponse containig poll with choices and votes if flag is set
 */
function queryPoll(id, res, req, withVotes=false){
  if(!id){
    return res.send(400, {
      error: 'It seems that your website address is missing the id of the poll.'
    });
  }

  Poll.findOne(id).then((poll)=> {
    if(!poll){
      return res.send(404, {
        error: 'The poll you are looking for seems to be missing.'
      });
    }
    Poll.findOne(id).populateAll().then((choices)=> {
      let result;

      if (withVotes){
        const choiceIds = choices.choices.map((value)=> {
          return value.id;
        });
        Vote.find({choice_id: choiceIds}).then((votes)=> {
          result = {
            data: Object.assign({}, poll, choices, {votes: votes})
          };
          return res.send(200, result);
        }, (err)=> {
          return res.send(400, {
            error: 'Failed to find the poll :('
          });
        });
      }

      if(!withVotes){
        result = {
          data: Object.assign({}, poll, choices)
        }; 
        return res.send(200, result);
      }
      
      
    }, (err)=> {
      return res.send(400, {
        error: 'Failed to find the poll :('
      });
    });
  });
}

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
    if(!req.body.choices){
      return res.send(400, {
        error: 'Your poll needs to have some choices first.'
      });
    }    
    Poll.create(newPoll).then((poll)=> {
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
        return res.send(201, result);
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
    return queryPoll(req.param('id'), res, req);
  },
  /**
   * Get existing poll with results. /poll/:id/results
   *
   * @return {object} Sails ServerResponse containing the poll (including results) which was requested.
   */
  results(req, res) {
    return queryPoll(req.param('id'), res, req, true);
  },
  /**
   * Add 1 vote to a choice. /poll/:id/vote
   *
   * @return {integer} Sails ServerResponse containing void or error message in case of error.
   */
  vote(req, res) {
    const pollID = req.param('id');

    if(!req.body.choice_id){
      return res.send(400, {
        error: 'Cant\'t find out which choice you wanted to vote.'
      });
    }

    Choice.findOne(req.body.choice_id).then((choice)=> {
      if(!choice){
        return res.send(404, {
          error: 'The choice you wanted to vote seems to be missing.'
        });
      }

      Vote.findOne(req.body.choice_id).then((foundVote)=> {
        if(!foundVote){
          newVote = {
            choice_id: choice.id,
            votes: 1
          }

          Vote.create(newVote).then((createdVote)=> {
            return res.send(201);
          }, (err)=> {
            return res.send(400, {
              error: 'Failed to save the vote :('
            });            
          });
        }

        if(foundVote){
          const update = {
            votes: foundVote.votes + 1
          };
          sails.log(update)
          Vote.update({choice_id: req.body.choice_id}, update).then((updatedVote)=> {
            return res.send(200);
          }, (err)=> {
            return res.send(400, {
              error: 'Failed to save the vote :('
            });            
          });
        } 
        
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

