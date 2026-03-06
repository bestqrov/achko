const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    numero: { type: String, required: true },
    type: { type: String, enum: ['facture', 'avoir'], default: 'facture' },
    client: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    echeance: { type: Date },
    lignes: [
      {
        description: String,
        quantite: Number,
        prixUnitaire: Number,
        tva: { type: Number, default: 20 },
        montantHT: Number,
        montantTTC: Number,
      },
    ],
    montantHT: { type: Number, default: 0 },
    montantTVA: { type: Number, default: 0 },
    montantTTC: { type: Number, default: 0 },
    statut: { type: String, enum: ['brouillon', 'envoyée', 'payée', 'annulée'], default: 'brouillon' },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

FactureSchema.index({ agencyId: 1, numero: 1 }, { unique: true });

module.exports = mongoose.model('Facture', FactureSchema);
