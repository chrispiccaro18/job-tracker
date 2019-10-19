require('dotenv').config();
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const connect = require('./lib/utils/connect');
const getJobBoard = require('./get-job-board');
const JobBoard = require('./lib/models/JobBoard');
const { mailer } = require('./mailer');
const discernChanges = require('./lib/helpers/discern-changes');


schedule.scheduleJob('* * * * *', async() => {
  try {
    const newJobs = await getJobBoard();
    await connect();
    const oldJobBoard = JobBoard.find().populate('jobs').lean();
    const oldJobs = oldJobBoard.jobs;
    
    const [additions, deletions] = discernChanges(oldJobs, newJobs);
    
    //TODO: write construct email func
    // const APPTIO_URL = 'https://www.apptio.com/company/careers/job-openings';
    const [updateSubject, updateBody] = constructEmail(additions, deletions);

    await mailer(updateSubject, updateBody);
  } catch(e) {
    console.error(e);
  }
  mongoose.connection.close();
});
