const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const JobBoard = require('../../lib/models/JobBoard');
const Job = require('../../lib/models/Job');
const {
  testRawData,
  addedJobRaw,
} = require('../testJobs');

const updateDb = async(additions, deletions, oldJobBoard) => {
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
        const createdJob = await Job.create(addedJob);
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
      const i = updatedJobIds.findIndex(id => id === idToDelete);
      return [...acc.slice(0, i), ...updatedJobIds.slice(i + 1)];
    }, updatedJobIds);
  }

  await JobBoard.findByIdAndUpdate(dbId, { ...oldJobBoard, jobs: updatedJobIds });
};

describe('update database function', () => {
  let initializedDb = [];

  beforeAll(() => {
    return connect('mongodb://localhost:27017/test');
  });

  beforeEach(async() => {
    await mongoose.connection.dropDatabase();
    const jobIds = await Promise.all(
      testRawData.map(async job => {
        const createdJob = await Job.create(job);
        return createdJob._id;
      })
    );
    await JobBoard.create({ company: 'apptio', jobs: jobIds });
    initializedDb = await JobBoard.find().populate('jobs').lean();
    return;
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('doesn\'t do anything if there are no updates', async() => {
    const additions = [];
    const deletions = [];
    await updateDb(additions, deletions);
    const updatedDb = await JobBoard.find().populate('jobs').lean();
    expect(updatedDb).toEqual(initializedDb);
  });
  
  it('updates the database if there are updates', async() => {
    const [initializedDbObj] = initializedDb;
    const additions = [addedJobRaw];
    const deletions = [initializedDbObj.jobs[1]];

    await updateDb(additions, deletions, initializedDbObj);
    const updatedDb = await JobBoard.find().populate('jobs').lean();
    const expectedJobs = [
      ...removeFromArray(initializedDbObj.jobs, initializedDbObj.jobs[1]),
      { ...addedJobRaw, _id: expect.any(mongoose.Types.ObjectId), __v: 0 }
    ];
    expect(updatedDb).toEqual([{ ...initializedDbObj, jobs: expectedJobs }]);
  });
});

const removeFromArray = (array, item) => {
  const i = array.findIndex(({ id }) => id === item.id);
  return [...array.slice(0, i), ...array.slice(i + 1)];
};
