const Job = require('../models/Job');
const JobBoard = require('../models/JobBoard');

module.exports = async(additions, deletions, oldJobBoard) => {
  if(additions.length <= 0 && deletions.length <= 0) return;

  const {
    _id: dbId,
    jobs: oldJobs
  } = oldJobBoard;

  const oldJobIds = oldJobs.map(oldJob => oldJob._id);

  let updatedJobIds = [...oldJobIds];

  if(additions.length > 0) {
    const newJobIds = await Promise.all(
      additions.map(async addedJob => {
        const createdJob = await Job.create({ job: addedJob });
        return createdJob._id;
      })
    );
    updatedJobIds = [...oldJobIds, ...newJobIds];
  }

  if(deletions.length > 0) {
    const deletedJobIds = await Promise.all(
      deletions.map(async jobToDelete => {
        await Job.findByIdAndDelete(jobToDelete._id);
        return jobToDelete._id;
      })
    );
    updatedJobIds = deletedJobIds.reduce((acc, idToDelete) => {
      const i = acc.findIndex(id => id === idToDelete);
      return [...acc.slice(0, i), ...acc.slice(i + 1)];
    }, updatedJobIds);
  }

  await JobBoard.findByIdAndUpdate(dbId, { ...oldJobBoard, jobs: updatedJobIds });
  return;
};
