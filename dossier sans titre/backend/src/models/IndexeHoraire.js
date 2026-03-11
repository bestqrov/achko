const mongoose = require('mongoose');

const IndexeHoraireSchema = new mongoose.Schema(
  {
    agencyId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    indexeHoraireDate: { type: Date, required: true },
    heures:            { type: Number, required: true, min: 0 },
    commentaire:       { type: String, default: '' },
    createdBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IndexeHoraire', IndexeHoraireSchema);
