const mongoose = require('mongoose');

const KilometrageSchema = new mongoose.Schema(
  {
    agencyId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    kilometrageDate: { type: Date, required: true },
    kilometres:      { type: Number, required: true, min: 0 },
    commentaire:     { type: String, default: '' },
    createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Kilometrage', KilometrageSchema);
