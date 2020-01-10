const { Router } = require('express');
const JobBoard = require('../models/JobBoard');

module.exports = Router()
  .get('/', async(req, res, next) => {
    try {
      const companies = await JobBoard.find().select('company').lean();
      res.send(companies);
    } catch(e) {
      next(e);
    }
  });
