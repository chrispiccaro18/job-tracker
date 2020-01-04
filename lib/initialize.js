require('dotenv').config();
require('./utils/connect')();
const mongoose = require('mongoose');
const JobBoard = require('./models/JobBoard');
const Job = require('./models/Job');
const getJobBoards = require('./helpers/get-job-boards');
const { mailer } = require('./utils/mailer');

const initializeDB = async() => {
  try {
    await mongoose.connection.dropDatabase();

    const jobBoards = await Promise.all(
      getJobBoards.map(async({ func, company, url }) => ({
        jobs: await func(),
        company,
        url,
      }))
    );

    await Promise.all(
      jobBoards.map(async({ jobs, company, url }) => {
        const jobIds = await Promise.all(
          jobs.map(async job => {
            const createdJob = await Job.create({ job });
            return createdJob._id;
          })
        );

        await JobBoard.create({ company, jobs: jobIds, url });
      })
    );

    const createdJobBoards = await JobBoard.find().populate('jobs').lean();
    console.log('Initialized Jobs: ', JSON.stringify(createdJobBoards, null, 2));

    const initializedJobCount = createdJobBoards.reduce((count, { jobs }) => count + jobs.length, 0);
    await mailer('Initialized DB', `Database initialized with ${initializedJobCount} jobs`);
  } catch(e) {
    console.error(e);
  }
  mongoose.connection.close();
};

initializeDB()
  .then(() => {
    console.log('Finished initializing DB');
    process.exit(0);
  })
  .catch(console.error);
