const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');
const auth = require('../middleware/auth');

// POST/UPDATE - Student creates or updates their profile
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create a profile' });
    }

    const { cgpa, graduationYear, branch, college, skills, bio } = req.body;

    // Check if profile already exists
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile.cgpa = cgpa;
      profile.graduationYear = graduationYear;
      profile.branch = branch;
      profile.college = college;
      profile.skills = skills;
      profile.bio = bio;
      await profile.save();
      return res.json({ message: 'Profile updated successfully', profile });
    }

    // Create new profile
    profile = new Profile({
      user: req.user.id,
      cgpa,
      graduationYear,
      branch,
      college,
      skills,
      bio
    });

    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Get my profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    if (profile && profile.resumeUrl) {
    const fs = require('fs');
    const filePath = '.' + profile.resumeUrl;
    if (!fs.existsSync(filePath)) {
    profile.resumeUrl = null;
    await profile.save();
   }
   } 

    res.json(profile);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Skill gap for a specific internship
router.get('/skillgap/:internshipId', auth, async (req, res) => {
  try {
    const Internship = require('../models/internship');

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Please complete your profile first' });
    }

    const internship = await Internship.findById(req.params.internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    const studentSkills = profile.skills.map(s => s.toLowerCase());
    const requiredSkills = internship.requiredSkills.map(s => s.toLowerCase());

    const matchedSkills = requiredSkills.filter(s => studentSkills.includes(s));
    const missingSkills = requiredSkills.filter(s => !studentSkills.includes(s));

    const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

    // Eligibility check
    const cgpaEligible = profile.cgpa >= internship.minCGPA;
    const yearEligible = !internship.graduationYear || profile.graduationYear === internship.graduationYear;

    res.json({
      internshipTitle: internship.title,
      matchPercentage,
      matchedSkills,
      missingSkills,
      cgpaEligible,
      yearEligible,
      eligible: cgpaEligible && yearEligible && missingSkills.length === 0
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



module.exports = router;