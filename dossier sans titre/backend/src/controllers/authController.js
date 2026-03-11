const authService = require('../services/authService');

// @desc    Register agency + admin user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { user, agency } = await authService.register(req.body);
    const token = user.getSignedJwtToken();
    res.status(201).json({
      success: true,
      message: 'Agency registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        agencyId: agency._id,
        agencyName: agency.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const { token, user } = await authService.login(email, password);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
      },
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

// @desc    Logout (client-side token removal)
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
