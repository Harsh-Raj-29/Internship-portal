const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `resume-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST - Upload resume
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can upload resume' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const Profile = mongoose.models.Profile || require('../models/profile');
    await Profile.findOneAndUpdate(
      { user: req.user.id },
      { resumeUrl },
      { new: true, upsert: true }
    );

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Remove resume
router.delete('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can delete resume' });
    }

    const Profile = mongoose.models.Profile || require('../models/profile');
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({ message: 'No resume found' });
    }

    const filePath = '.' + profile.resumeUrl;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Profile.findOneAndUpdate(
      { user: req.user.id },
      { resumeUrl: null },
      { new: true }
    );

    res.json({ message: 'Resume deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;