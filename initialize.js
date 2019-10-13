require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');
const JobBoard = require('./lib/models/JobBoard');
const Job = require('./lib/models/Job');
const getJobBoard = require('./get-job-board');

const initializeDB = async() => {
  try {
    const jobBoard = await getJobBoard();
    const jobIds = await Promise.all(
      jobBoard.map(async job => {
        const createdJob = await Job.create(job);
        return createdJob._id;
      })
    );
    await JobBoard.create({ company: 'apptio', jobs: jobIds });
    console.log('Initialized Jobs:', await JobBoard.find().lean());
  } catch(e) {
    console.error(e);
  }
  mongoose.connection.close();
};

initializeDB()
  .then(() => console.log('Finished initializing DB'))
  .catch(console.error);
