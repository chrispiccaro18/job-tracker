const discernChanges = require('../../lib/helpers/discern-changes');
const {
  databaseTestJobs,
  addedTestJobs,
  expectedAddedJob,
  expectedDeletedJob
} = require('./testJobs');

describe('discern changes function', () => {
  it('finds added jobs', () => {
    const [addedJobs, deletedJobs] = discernChanges(databaseTestJobs, addedTestJobs);
    expect(addedJobs).toEqual([expectedAddedJob]);
    expect(deletedJobs).toEqual([expectedDeletedJob]);
  });
});
