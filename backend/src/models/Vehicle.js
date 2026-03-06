const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    matricule: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    type: { type: String, enum: ['car', 'truck', 'van', 'bus', 'motorcycle'], default: 'car' },
    fuel: { type: String, enum: ['diesel', 'essence', 'electric', 'hybrid'], default: 'diesel' },
    status: { type: String, enum: ['available', 'in_use', 'maintenance', 'retired'], default: 'available' },
    mileage: { type: Number, default: 0 },
    color: { type: String },
    chassisNumber: { type: String },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

VehicleSchema.index({ agencyId: 1, matricule: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
