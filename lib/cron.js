require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('./utils/connect');
const getJobBoard = require('./helpers/get-job-board');
const JobBoard = require('./models/JobBoard');
// eslint-disable-next-line no-unused-vars
const Job = require('./models/Job');
const discernChanges = require('./helpers/discern-changes');
const updateDb = require('./utils/update-db');
const { constructEmail } = require('./helpers/constructEmail');
const { mailer } = require('./utils/mailer');

// https://www.howtogeek.com/101288/how-to-schedule-tasks-on-linux-an-introduction-to-crontab-files/


const cron = async() => {
  const updates = [];
  try {
    await connect();
    const oldJobBoards = await JobBoard.find().populate('jobs').lean();
    const newJobBoards = await Promise.all(
      oldJobBoards.map(async oldJobBoard => {
        const { jobs: oldJobs, url, company } = oldJobBoard;
        const newJobs = await getJobBoard(url);
        const [additions, deletions] = discernChanges(oldJobs, newJobs);
        updates.push({ company, additions, deletions });
        return await updateDb(additions, deletions, oldJobBoard);
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
