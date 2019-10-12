require('dotenv').config();
const request = require('superagent');

module.exports = async() => {
  const res = await request.get(process.env.JOB_BOARD);
  return res.body.departments
    .find(({ name }) => name === 'Engineering')
    .jobs.filter(({ location }) => location.name === 'Portland, OR');
};
