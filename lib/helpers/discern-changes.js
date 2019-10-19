module.exports = (dbJobs, newJobs) => (
  [
    findDifferenceInArraysOfObjects(newJobs, dbJobs),
    findDifferenceInArraysOfObjects(dbJobs, newJobs),
  ]
);

const findDifferenceInArraysOfObjects = (arr1, arr2) => 
  arr1.filter(obj1 => 
    !arr2.some(obj2 => 
      obj1.id === obj2.id));
