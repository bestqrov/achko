const express = require('express');
const router = express.Router();
const Agency = require('../models/Agency');
const { protect, authorize } = require('../middleware/auth');

// Only superadmin can manage agencies
router.use(protect);

router.get('/', authorize('superadmin'), async (req, res, next) => {
  try {
    const agencies = await Agency.find().sort('-createdAt');
    res.status(200).json({ success: true, data: agencies });
  } catch (err) { next(err); }
});

router.get('/:id', authorize('superadmin', 'admin'), async (req, res, next) => {
  try {
    const agency = await Agency.findById(req.params.id);
    if (!agency) return res.status(404).json({ success: false, message: 'Agency not found' });
    res.status(200).json({ success: true, data: agency });
  } catch (err) { next(err); }
});

router.put('/:id', authorize('superadmin', 'admin'), async (req, res, next) => {
  try {
    const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: agency });
  } catch (err) { next(err); }
});

module.exports = router;
