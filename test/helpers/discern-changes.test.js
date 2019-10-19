const discernChanges = require('../../lib/helpers/discern-changes');
const {
  databaseTestJobs,
  newTestJobs,
  expectedAddedJob,
  expectedDeletedJob
} = require('../testJobs');

describe('discern changes function', () => {
  it('finds added jobs', () => {
    const [addedJobs, deletedJobs] = discernChanges(databaseTestJobs, newTestJobs);
    expect(addedJobs).toEqual([expectedAddedJob]);
    expect(deletedJobs).toEqual([expectedDeletedJob]);
  });
});
