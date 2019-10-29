require('../connect-db');
const mongoose = require('mongoose');
const JobBoard = require('../../lib/models/JobBoard');

describe('JobBoard model tests', () => {
  it('has a company, url, and jobs', () => {
    const jobId1 = new mongoose.Types.ObjectId;
    const jobId2 = new mongoose.Types.ObjectId;
    const jobBoard = new JobBoard({
      company: 'test company',
      jobs: [jobId1, jobId2],
      url: 'test url',
    });

    expect(jobBoard.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      company: 'test company',
      jobs: [jobId1, jobId2],
      url: 'test url',
    });
  });

  it('has a required user field', () => {
    const jobBoard = new JobBoard({});

    const errors = jobBoard.validateSync().errors;
    expect(errors.company.message).toBe('Path `company` is required.');
    expect(errors.url.message).toBe('Path `url` is required.');
  });
});
