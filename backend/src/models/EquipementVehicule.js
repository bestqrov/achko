const mongoose = require('mongoose');

const EquipementVehiculeSchema = new mongoose.Schema(
  {
    agencyId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    code:          { type: String, default: '' },
    libelle:       { type: String, default: '' },
    typeEquipement:{ type: String, default: '' },
    fournisseur:   { type: String, default: '' },
    dateAchat:     { type: Date },
    description:   { type: String, default: '' },
    montantHT:     { type: Number, default: 0 },
    tva:           { type: Number, default: 20 },
    montantTTC:    { type: Number, default: 0 },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EquipementVehicule', EquipementVehiculeSchema);
