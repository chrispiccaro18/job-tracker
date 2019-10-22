const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  job: {
    type: Object,
    required: true,
  }
});

module.exports = mongoose.model('Job', jobSchema);
