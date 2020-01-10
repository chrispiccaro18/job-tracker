const { Router } = require('express');
const Job = require('../models/Job');
const JobBoard = require('../models/JobBoard');

module.exports = Router()
  .get('/', async(req, res, next) => {
    try {
      const jobs = await Job.find().lean();
      res.send(jobs);
    } catch(e) {
      next(e);
    }
  })
  
  .get('/:company', async(req, res, next) => {
    const { company } = req.params;
    try {
      const foundJobBoard = await JobBoard.findOne({ company: company.toLowerCase() }).populate('jobs').lean();
        
      if(!foundJobBoard) next({
        status: 400,
        message: 'symbol not found'
      });

      res.send(foundJobBoard);
    } catch(e) {
      next(e);
    }
  });
