require('dotenv').config();
require('./utils/connect')();
const mongoose = require('mongoose');
const JobBoard = require('./models/JobBoard');
const Job = require('./models/Job');
const getJobBoard = require('./helpers/get-job-board');
const { mailer } = require('./utils/mailer');

const initializeDB = async() => {
  try {
    await mongoose.connection.dropDatabase();
    const jobBoard = await getJobBoard();
    const jobIds = await Promise.all(
      jobBoard.map(async job => {
        const createdJob = await Job.create(job);
        return createdJob._id;
      })
    );
    await JobBoard.create({ company: 'apptio', jobs: jobIds });
    const createdJobBoard = await JobBoard.find().populate('jobs').lean();
    console.log('Initialized Jobs: ', JSON.stringify(createdJobBoard, null, 2));

    await mailer('Initialized DB', `Database initialized with ${createdJobBoard[0].jobs.length} jobs`);
  } catch(e) {
    console.error(e);
  }
  mongoose.connection.close();
};

initializeDB()
  .then(() => console.log('Finished initializing DB'))
  .catch(console.error);
