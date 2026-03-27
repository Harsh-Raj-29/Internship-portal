const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const Internship = require('../models/internship');
const auth = require('../middleware/auth');

// POST - Student applies to internship
router.post('/:internshipId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply' });
    }

    const internship = await Internship.findById(req.params.internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if already applied
    const existing = await Application.findOne({
      student: req.user.id,
      internship: req.params.internshipId
    });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this internship' });
    }

    const application = new Application({
      student: req.user.id,
      internship: req.params.internshipId,
      coverLetter: req.body.coverLetter
    });

    await application.save();
    res.status(201).json({ message: 'Applied successfully!', application });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Student sees their own applications
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ student: req.user.id })
      .populate('internship', 'title location stipend duration company')
      .sort({ createdAt: -1 });

    const valid = applications.filter(a => a.internship !== null);
    res.json(valid);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH - Company updates application status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can update status' });
    }

    const { status } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'rejected', 'selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Status updated', application });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET - Company sees applications for their internship
router.get('/internship/:internshipId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({
      internship: req.params.internshipId
    })
      .populate('student', 'name email')
      .populate('internship', 'title location stipend')
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;