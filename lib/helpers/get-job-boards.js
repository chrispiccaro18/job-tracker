require('dotenv').config();
const request = require('superagent');

const getApptioJobBoard = async() => {
  const res = await request.get(process.env.APPTIO_JOB_BOARD);
  return res.body.departments
    .find(({ name }) => name === 'Engineering')
    .jobs.filter(({ location }) => location.name === 'Portland, OR');
};

const getWalmartJobBoard = async() => {
  const res = await request.get(process.env.WALMART_JOB_BOARD);
  return res.body.result.entities
    .filter(({ department_name }) => department_name === 'Software Development and Engineering')
    .filter(({ original_location }) => original_location === 'PORTLAND, OR');
};

module.exports = [
  {
    func: getApptioJobBoard,
    company: 'apptio',
    url: process.env.APPTIO_JOB_BOARD,
  },
  {
    func: getWalmartJobBoard,
    company: 'walmart',
    url: process.env.WALMART_JOB_BOARD,
  },
];
