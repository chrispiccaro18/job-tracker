const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  absolute_url: {
    type: String,
  },
  internal_job_id: {
    type: Number,
    required: true,
  },
  _id: {
    type: Number,
    required: true,
  },
  location: {
    name: {
      type: String,
    }
  },
  metadata: [Object],
  id: {
    type: Number,
  },
  updated_at: {
    type: String,
  },
  requisition_id: {
    type: Number,
    required: () => {
      return typeof this.requisition_id === 'undefined' || (this.requisition_id !== null && typeof this.requisition_id !== 'number');
    }
  },
  title: {
    type: String,
  },
});

module.exports = mongoose.model('Job', jobSchema);
