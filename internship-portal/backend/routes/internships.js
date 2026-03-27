const express = require('express');
const router = express.Router();
const Internship = require('../models/internship');
const auth = require('../middleware/auth');

// POST - Company posts an internship
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can post internships' });
    }

    const {
      title, location, duration, stipend,
      description, requiredSkills, minCGPA,
      graduationYear, openings
    } = req.body;

    const internship = new Internship({
      company: req.user.id,
      title,
      location,
      duration,
      stipend,
      description,
      requiredSkills,
      minCGPA,
      graduationYear,
      openings
    });

    await internship.save();
    res.status(201).json({ message: 'Internship posted successfully', internship });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Search internships
router.get('/', async (req, res) => {
  try {
    const { role, location, minStipend, graduationYear } = req.query;

    let filter = { isActive: true };

    if (role) {
      filter.title = { $regex: role, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (minStipend) {
      filter.stipend = { $gte: Number(minStipend) };
    }
    if (graduationYear) {
      filter.graduationYear = Number(graduationYear);
    }
    
    const internships = await Internship.find(filter)
    .populate('company', 'name email isVerified')
     .sort({ createdAt: -1 });

    res.json(internships);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Single internship by ID
router.get('/:id', async (req, res) => {
  try {
   
     const internship = await Internship.findById(req.params.id)
  .populate('company', 'name email isVerified');


    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json(internship);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE - Company deletes their internship
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can delete internships' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own internships' });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST - Student reports an internship
router.post('/:id/report', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can report internships' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if already reported
    const alreadyReported = internship.reports.find(
      r => r.student.toString() === req.user.id
    );
    if (alreadyReported) {
      return res.status(400).json({ message: 'You have already reported this internship' });
    }

    internship.reports.push({
      student: req.user.id,
      reason: req.body.reason
    });
    internship.reportCount = internship.reports.length;
    await internship.save();

    res.json({ message: 'Internship reported successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
 
// PUT - Company edits their internship
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can edit internships' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.company.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own internships' });
    }

    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json({ message: 'Internship updated successfully', internship: updated });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH - Admin dismisses reports
router.patch('/:id/dismiss', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { reports: [], reportCount: 0 },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json({ message: 'Reports dismissed successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;