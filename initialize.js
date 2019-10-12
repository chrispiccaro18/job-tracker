require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');
const JobBoard = require('./lib/models/JobBoard');
const getJobBoard = require('./get-job-board');

const initializeDB = async() => {
  try {
    const jobBoard = await getJobBoard();
    const jobs = jobBoard.map(job => job.internal_job_id);
    await JobBoard.create({ company: 'apptio', jobs });
    console.log(await JobBoard.find().lean());
  } catch(e) {
    console.error(e);
  }
  mongoose.connection.close();
};

initializeDB()
  .then(() => console.log('Finished initializing DB'));
