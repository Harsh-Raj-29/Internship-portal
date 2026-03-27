const mongoose = require('mongoose');
const internshipSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String },
  stipend: { type: Number },
  description: { type: String },
  requiredSkills: [{ type: String }],
  minCGPA: { type: Number, default: 0 },
  graduationYear: { type: Number },
  openings: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  reports: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String },
    reportedAt: { type: Date, default: Date.now }
  }],
  reportCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);