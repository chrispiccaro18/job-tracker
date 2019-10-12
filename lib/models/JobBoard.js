const mongoose = require('mongoose');

const jobBoardSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  jobs: [String]
});

module.exports = mongoose.model('JobBoard', jobBoardSchema);
