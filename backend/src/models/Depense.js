const mongoose = require('mongoose');

const DepenseSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    type: {
      type: String,
      enum: ['carburant', 'autoroute', 'parking', 'lavage', 'reparation', 'divers'],
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String },
    montant: { type: Number, required: true },
    devise: { type: String, default: 'MAD' },
    // Carburant specific
    quantite: { type: Number }, // litres
    prixUnitaire: { type: Number },
    station: { type: String },
    kilometrage: { type: Number },
    // Autoroute specific
    troncon: { type: String },
    peageDepart: { type: String },
    peageArrivee: { type: String },
    // General
    fournisseur: { type: String },
    numeroFacture: { type: String },
    tva: { type: Number, default: 20 },
    montantHT: { type: Number },
    montantTTC: { type: Number },
    // Justification
    justificatif: { type: String }, // URL to receipt/document
    notes: { type: String },
    statut: {
      type: String,
      enum: ['en_attente', 'approuvee', 'rejetee', 'remboursee'],
      default: 'en_attente',
    },
  },
  { timestamps: true }
);

// Calculate TTC before saving
DepenseSchema.pre('save', function(next) {
  if (this.montant && this.tva) {
    this.montantHT = this.montant / (1 + this.tva / 100);
    this.montantTTC = this.montant;
  } else if (this.montantHT && this.tva) {
    this.montantTTC = this.montantHT * (1 + this.tva / 100);
    this.montant = this.montantTTC;
  }
  next();
});

module.exports = mongoose.model('Depense', DepenseSchema);