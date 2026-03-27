const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cgpa: { type: Number, min: 0, max: 10 },
  graduationYear: { type: Number },
  branch: { type: String },          // e.g. "Computer Science"
  college: { type: String },
  skills: [{ type: String }],        // e.g. ["HTML", "CSS", "JavaScript"]
  resumeUrl: { type: String },       // file path after upload
  bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);