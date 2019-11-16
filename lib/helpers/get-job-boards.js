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

const getAirbnbJobBoard = async() => {
  const res = await request.get(process.env.AIRBNB_JOB_BOARD);
  const engineeringId = res.body.departments.find(({ name }) => name === 'Engineering').id;
  const portlandId = res.body.locations.find(({ name }) => name === 'Portland, United States').id;

  return res.body.jobs.filter(job => {
    const { deptId, locations, locationId } = job;
    const isPortland = locationId === portlandId || locations.some(({ locationId }) => locationId === portlandId);
    return deptId === engineeringId && isPortland;
  });
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
  {
    func: getAirbnbJobBoard,
    company: 'airbnb',
    url: 'https://careers.airbnb.com/positions',
  }
];
