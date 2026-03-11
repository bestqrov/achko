const mongoose = require('mongoose');

const ContratAchatSchema = new mongoose.Schema(
  {
    agencyId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    fournisseur:   { type: String, default: '' },
    dateAchat:     { type: Date },
    numeroContrat: { type: String, default: '' },
    garantie:      { type: String, default: '' },
    montantHT:     { type: Number, default: 0 },
    tva:           { type: Number, default: 20 },
    montantTTC:    { type: Number, default: 0 },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContratAchat', ContratAchatSchema);
