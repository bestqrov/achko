const mongoose = require('mongoose');

const VehiculeReformeSchema = new mongoose.Schema(
  {
    agencyId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    dateReforme:   { type: Date },
    typeReforme:   { type: String, default: '' },
    montant:       { type: Number, default: 0 },
    commentaire:   { type: String, default: '' },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VehiculeReforme', VehiculeReformeSchema);
