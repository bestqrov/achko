const User = require('../models/User');
const Agency = require('../models/Agency');

exports.register = async ({ agencyName, agencyEmail, firstName, lastName, email, password }) => {
  // Create agency first
  const agency = await Agency.create({ name: agencyName, email: agencyEmail });

  // Create super admin user for this agency
  const user = await User.create({
    agencyId: agency._id,
    firstName,
    lastName,
    email,
    password,
    role: 'admin',
  });

  return { user, agency };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials');
  if (!user.isActive) throw new Error('Account is inactive');

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = user.getSignedJwtToken();
  return { token, user };
};
