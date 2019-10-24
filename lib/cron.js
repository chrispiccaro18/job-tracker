require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('./utils/connect');
const getJobBoards = require('./helpers/get-job-boards');
const JobBoard = require('./models/JobBoard');
// eslint-disable-next-line no-unused-vars
const Job = require('./models/Job');
const discernChanges = require('./helpers/discern-changes');
const updateDb = require('./utils/update-db');
const { constructEmail } = require('./helpers/constructEmail');
const { mailer } = require('./utils/mailer');

// https://www.howtogeek.com/101288/how-to-schedule-tasks-on-linux-an-introduction-to-crontab-files/

const cron = async() => {
  try {
    await connect();
    const oldJobBoards = await JobBoard.find().populate('jobs').lean();
    const newJobBoards = await Promise.all(
      getJobBoards.map(async({ func, company, url }) => ({
        jobs: await func(),
        company,
        url,
      }))
    );

    const updates = await Promise.all(
      oldJobBoards.map(async(oldJobBoard, i) => {
        const { company } = oldJobBoard;
        const oldJobs = oldJobBoard.jobs.map(nestedJob => nestedJob.job);
        const newJobs = newJobBoards[i].jobs.map(nestedJob => nestedJob.job);

        const [additions, deletions] = discernChanges(oldJobs, newJobs);

        await updateDb(additions, deletions);
        
        return {
          additions,
          deletions,
          company,
        };
      })
    );
    
    const [updateSubject, updateBody] = constructEmail(updates);

    await mailer(updateSubject, updateBody);
  } catch(e) {
    console.error(e);
  }
  mongoose.connection.close();
};

cron();
