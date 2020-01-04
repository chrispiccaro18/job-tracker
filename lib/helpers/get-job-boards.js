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
  const { departments, locations, jobs } = res.body;
  
  const engineeringId = departments.find(({ name }) => name === 'Engineering').id;
  const portlandId = locations.find(({ name }) => name === 'Portland, United States').id;

  return jobs.filter(job => {
    const { deptId, locations, locationId } = job;
    const isPortland = locationId === portlandId || locations.some(({ locationId }) => locationId === portlandId);
    return deptId === engineeringId && isPortland;
  });
};

const getAmazonJobBoard = async() => {
  const res = await request.get(process.env.AMAZON_JOB_BOARD);
  const { hits, jobs: firstJobs } = res.body;
  
  let allJobs = firstJobs;

  const groupsOfTen = Math.ceil(hits / 10);

  for(let i = 1; i < groupsOfTen; i++) {
    const offset = i * 10;

    const res = await request.get(`${process.env.AMAZON_JOB_BOARD}&offset=${offset}`);
    allJobs = [...allJobs, ...res.body.jobs];
  }

  return allJobs;
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
  },
  {
    func: getAmazonJobBoard,
    company: 'amazon',
    url: 'https://www.amazon.jobs/en',
  }
];
