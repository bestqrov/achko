const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/jwt');

const UserSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'manager', 'driver', 'viewer'],
      default: 'viewer',
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    avatar: { type: String },
    phone: { type: String },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Sign JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, agencyId: this.agencyId, role: this.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual: full name
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);
