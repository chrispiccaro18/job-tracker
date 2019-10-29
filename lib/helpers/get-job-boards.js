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
    .filter(({ original_location }) => original_location === 'PORTLAND, OR')
    .map(job => ({ ...job, id: job.key }));
};

module.exports = [
  {
    func: getApptioJobBoard,
    company: 'apptio',
    url: 'https://www.apptio.com/company/careers/job-openings',
  },
  {
    func: getWalmartJobBoard,
    company: 'walmart',
    url: 'https://walmart.rolepoint.com/?shorturl=LawD5',
  },
];
