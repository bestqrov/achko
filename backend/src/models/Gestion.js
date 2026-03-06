const mongoose = require('mongoose');

const GestionSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    type: { type: String, enum: ['contrat', 'salaire'], required: true },
    // Contrat
    employe: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    typeContrat: { type: String, enum: ['CDI', 'CDD', 'interim', 'stage'] },
    dateDebut: { type: Date },
    dateFin: { type: Date },
    poste: { type: String },
    salaireBrut: { type: Number },
    salaireNet: { type: Number },
    // Salaire
    mois: { type: Number, min: 1, max: 12 },
    annee: { type: Number },
    primes: [{ libelle: String, montant: Number }],
    deductions: [{ libelle: String, montant: Number }],
    statut: { type: String, enum: ['actif', 'terminé', 'suspendu', 'payé', 'en_attente'], default: 'actif' },
    document: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gestion', GestionSchema);
