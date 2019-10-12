require('dotenv').config();
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const connect = require('./lib/utils/connect');
const getJobBoard = require('./get-job-board');
const JobBoard = require('./lib/models/JobBoard');

// if not, what was added? what was deleted? -> email that
// if so, have any of the updated_at fields changed?
// if not, move on
// if so, find out what changed -> email that

schedule.scheduleJob('* * * * *', async() => {
  let isJobBoardUpdated = false;
  const newJobBoard = await getJobBoard();
  const newJobs = newJobBoard.jobs;
  connect();
  const oldJobBoard = JobBoard.find().lean();
  const oldJobs = oldJobBoard.jobs;
  if(newJobs.length !== oldJobs.length) isJobBoardUpdated = true;
  // check to see if they are the same ids
  if(isJobBoardUpdated) {
    // do update stuff
  }
  mongoose.connection.close();
});
