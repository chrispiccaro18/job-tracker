require('dotenv').config();
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const connect = require('./utils/connect');
const getJobBoard = require('./helpers/get-job-board');
const JobBoard = require('./models/JobBoard');
// eslint-disable-next-line no-unused-vars
const Job = require('./models/Job');
const { mailer } = require('./utils/mailer');
const discernChanges = require('./helpers/discern-changes');
const { constructEmail } = require('./helpers/constructEmail');


schedule.scheduleJob('0 8 * * *', async() => {
  try {
    const newJobs = await getJobBoard();
    await connect();
    const [oldJobBoard] = await JobBoard.find().populate('jobs').lean();
    const oldJobs = oldJobBoard.jobs;

    const [additions, deletions] = discernChanges(oldJobs, newJobs);
    
    const [updateSubject, updateBody] = constructEmail(additions, deletions);

    await mailer(updateSubject, updateBody);
  } catch(e) {
    console.error(e);
  }
  mongoose.connection.close();
});
