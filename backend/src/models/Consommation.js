const mongoose = require('mongoose');

const ConsommationSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: {
      type: String,
      enum: ['carburant', 'carte', 'autoroute', 'depense'],
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    montant: { type: Number, required: true },
    quantite: { type: Number }, // litres for carburant
    prixUnitaire: { type: Number },
    station: { type: String },
    kilometrage: { type: Number },
    // For cartes
    numeroCarte: { type: String },
    // For autoroutes
    troncon: { type: String },
    // For depenses
    categorie: { type: String },
    description: { type: String },
    justificatif: { type: String }, // file path/URL
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consommation', ConsommationSchema);
