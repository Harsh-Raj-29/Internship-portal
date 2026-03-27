// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['student', 'company'], required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'company', 'admin'], required: true },
  isVerified: { type: Boolean, default: false },
  companyWebsite: { type: String },
  companyLinkedIn: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);