require('../connect-db');
const mongoose = require('mongoose');
const JobBoard = require('../../lib/models/JobBoard');

describe('JobBoard model tests', () => {
  it('has a company and jobs', () => {
    const jobBoard = new JobBoard({
      company: 'test company',
      jobs: ['job1', 'job2'],
    });

    expect(jobBoard.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      company: 'test company',
      jobs: ['job1', 'job2'],
    });
  });

  it('has a required user field', () => {
    const jobBoard = new JobBoard({});

    const errors = jobBoard.validateSync().errors;
    expect(errors.company.message).toBe('Path `company` is required.');
  });
});
