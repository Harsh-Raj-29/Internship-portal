const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Internship = require('../models/internship');
const auth = require('../middleware/auth');

// Middleware — admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// GET - All unverified companies
router.get('/companies', auth, adminOnly, async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH - Verify a company
router.patch('/verify/:companyId', auth, adminOnly, async (req, res) => {
  try {
    const company = await User.findByIdAndUpdate(
      req.params.companyId,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ message: 'Company verified successfully', company });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH - Unverify a company
router.patch('/unverify/:companyId', auth, adminOnly, async (req, res) => {
  try {
    const company = await User.findByIdAndUpdate(
      req.params.companyId,
      { isVerified: false },
      { new: true }
    ).select('-password');

    res.json({ message: 'Company unverified', company });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - All reported internships
router.get('/reports', auth, adminOnly, async (req, res) => {
  try {
    const reported = await Internship.find({ reportCount: { $gt: 0 } })
      .populate('company', 'name email isVerified')
      .sort({ reportCount: -1 });
    res.json(reported);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE - Admin removes a fake internship
router.delete('/internship/:id', auth, adminOnly, async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    await require('../models/application').deleteMany({ internship: req.params.id });
    res.json({ message: 'Internship removed by admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.patch('/fix-company', auth, adminOnly, async (req, res) => {
  try {
    const { oldCompanyId, newCompanyId } = req.body;

    const result = await Internship.updateMany(
      { company: oldCompanyId },
      { company: newCompanyId }
    );

    res.json({
      message: 'Fixed successfully',
      updatedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;