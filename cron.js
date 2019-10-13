require('dotenv').config();
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const connect = require('./lib/utils/connect');
const getJobBoard = require('./get-job-board');
const JobBoard = require('./lib/models/JobBoard');
const { mailer } = require('./mailer');

const APPTIO_URL = 'https://www.apptio.com/company/careers/job-openings';

// if not, what was added? what was deleted? -> email that
// if so, have any of the updated_at fields changed?
// if not, move on
// if so, find out what changed -> email that

schedule.scheduleJob('* * * * *', async() => {
  let isJobBoardUpdated = false;
  const newJobBoard = await getJobBoard();
  const newJobs = newJobBoard.jobs;
  const newJobsIds = newJobs.map(job => job.internal_job_id);
  await connect();
  const oldJobBoard = JobBoard.find().lean();
  const oldJobs = oldJobBoard.jobs;
  const oldJobsIds = oldJobs.map(job => job.internal_job_id);
  if(newJobsIds.length !== oldJobsIds.length) isJobBoardUpdated = true;
  // check to see if they are the same ids
  if(!isJobBoardUpdated) {
    const updatedJobIds = [];
    for(let i = 0; i < newJobs.length; i++) {

      if(!oldJobs.includes(newJobs[i])) {
        if(!isJobBoardUpdated) isJobBoardUpdated = true;
        updatedJobIds.push(newJobs[i]);
      }
    }
  }

  if(isJobBoardUpdated) {

    try {
      await mailer('Job Updates!', updateBody);
    } catch(e) {
      console.error(e);
    }
  } else {
    try {
      await mailer('No Job Updates', `
        No Updates to job board. Url to view: ${APPTIO_URL}
      `);
    } catch(e) {
      console.error(e);
    }
  }
  mongoose.connection.close();
});
