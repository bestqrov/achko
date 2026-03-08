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
    peageDepart:    { type: String },
    peageArrivee:   { type: String },
    typePaiement:   { type: String },
    montantHT:      { type: Number },
    tva:            { type: Number },
    montantTTC:     { type: Number },
    collaborateur:  { type: String },
    designation:    { type: String },
    numero:         { type: String },
    attachement:    { type: String },
    // For depenses
    categorie: { type: String },
    description: { type: String },
    justificatif: { type: String }, // file path/URL
    typePaiement:       { type: String },
    typeDep:            { type: String },
    numeroUtilisation:  { type: String },
    numeroImputation:   { type: String },
    unite:              { type: String },
    montantTTC:         { type: Number },
    direction:          { type: String },
    departement:        { type: String },
    commentaire:        { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consommation', ConsommationSchema);
