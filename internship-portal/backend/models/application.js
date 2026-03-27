const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'selected'],
    default: 'applied'
  },
  coverLetter: { type: String },
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);


