const schedule = require('node-schedule');
const request = require('superagent');

schedule.scheduleJob('0 0 * * *', async() => {
  const newJobBoard = await getJobBoard();
});

const getJobBoard = async() => {
  const res = await request.get(process.env.JOB_BOARD);
  return res.body.departments
    .find(({ name }) => name === 'Engineering')
    .jobs.filter(({ location }) => location.name === 'Portland, OR');
};

getJobBoard().then(console.log);

// check to see if they are the same ids
// if not, what was added? what was deleted? -> email that
// if so, have any of the updated_at fields changed?
// if not, move on
// if so, find out what changed -> email that
