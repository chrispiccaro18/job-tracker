require('../connect-db');
// const mongoose = require('mongoose');
const Job = require('../../lib/models/Job');

describe('Job model tests', () => {

  const testJob = {
    'absolute_url': 'https://www.apptio.com/company/careers/job-openings?gh_jid=1816826',
    'internal_job_id': 1138114,
    '_id': 1138114,
    'location': {
      'name': 'Bengaluru'
    },
    'metadata': [
      {
        'id': 188578,
        'name': 'Currency Type',
        'value': 'USD',
        'value_type': 'single_select'
      },
      {
        'id': 188572,
        'name': 'Budgeted',
        'value': true,
        'value_type': 'yes_no'
      },
      {
        'id': 188573,
        'name': 'PipelineReq',
        'value': true,
        'value_type': 'yes_no'
      },
      {
        'id': 188574,
        'name': 'ReqLevel',
        'value': 'Entry Level',
        'value_type': 'single_select'
      },
      {
        'id': 188575,
        'name': 'ReqCategory',
        'value': 'Development',
        'value_type': 'single_select'
      },
      {
        'id': 188584,
        'name': 'ReqType',
        'value': 'Full Time',
        'value_type': 'single_select'
      },
      {
        'id': 188576,
        'name': 'RecruiterLastName',
        'value': 'Asher',
        'value_type': 'short_text'
      },
      {
        'id': 188577,
        'name': 'RecruiterFirstName',
        'value': 'Bryan',
        'value_type': 'short_text'
      },
      {
        'id': 188579,
        'name': 'RecruiterE mail',
        'value': 'basher@apptio.com',
        'value_type': 'short_text'
      },
      {
        'id': 188581,
        'name': 'HiringManager Last Name',
        'value': 'Krishnan',
        'value_type': 'short_text'
      },
      {
        'id': 188580,
        'name': 'HiringManager First Name',
        'value': 'Subi',
        'value_type': 'short_text'
      },
      {
        'id': 188582,
        'name': 'HiringManagerEmail',
        'value': 'SKrishnan@apptio.com',
        'value_type': 'short_text'
      }
    ],
    'id': 1816826,
    'updated_at': '2019-09-13T18:51:11-04:00',
    'requisition_id': null,
    'title': 'Test Engineer I'
  };

  it('has absolute_url, internal_job_id, location, metadata, id, updated_at, requisition_id, title', () => {
    const job = new Job(testJob,
      { _id: testJob.internal_job_id }
    );

    expect(job.toJSON()).toEqual({
      _id: testJob.internal_job_id,
      ...testJob
    });
  });

  // it('has a required user field', () => {
  //   const job = new Job({});

  //   const errors = job.validateSync().errors;
  //   expect(errors.company.message).toBe('Path `company` is required.');
  // });
});
