const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String, default: 'Morocco' },
    logo: { type: String },
    isActive: { type: Boolean, default: true },
    plan: { type: String, enum: ['starter', 'pro', 'enterprise'], default: 'starter' },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Auto-generate slug from name
AgencySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Agency', AgencySchema);
