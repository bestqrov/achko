const mongoose = require('mongoose');

const AdministratifSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    type: {
      type: String,
      enum: [
        'vignette',
        'carte_grise',
        'visite_technique',
        'taxe',
        'agrement',
        'permis_circulation',
        'autorisation_circulation',
        'assurance',
        'assurance_internationale',
        'carnet_metrologique',
        'extincteur',
        'sinistre',
      ],
      required: true,
    },
    reference: { type: String },
    description: { type: String },
    dateEmission: { type: Date },   // dateDebut for vignette
    dateExpiration: { type: Date }, // dateFin for vignette
    organisme: { type: String },
    // Vignette-specific amount breakdown
    montantPrincipal: { type: Number, default: 0 },
    penalite:         { type: Number, default: 0 },
    majoration:       { type: Number, default: 0 },
    fraisService:     { type: Number, default: 0 },
    timbre:           { type: Number, default: 0 },
    tvaFraisService:  { type: Number, default: 0 },
    // Permis de circulation
    montantHT:    { type: Number, default: 0 },
    // Assurance-specific fields
    dateAssurance:     { type: Date },
    typeAssurance:     { type: String },
    numeroAttestation: { type: String },
    numeroPolice:      { type: String },
    dureeJours:        { type: Number, default: 0 },
    intermediaire:     { type: String },
    fraisTimbre:       { type: Number, default: 0 },
    fraisContrat:      { type: Number, default: 0 },
    // Visite technique amount breakdown
    tva:          { type: Number, default: 0 },
    timbres:      { type: Number, default: 0 },
    typeVisite:   { type: String },
    centreVisite: { type: String },
    cnpac:        { type: Number, default: 0 },
    taxeCom:      { type: Number, default: 0 },
    cneh:         { type: Number, default: 0 },
    // Sinistre-specific fields
    circonstances:   { type: String },
    infoAdverse:     { type: String },
    expert:          { type: String },
    temoins:         { type: String },
    autres:          { type: String },
    dateDeclaration: { type: Date },
    typeSinistre:    { type: String },
    lieu:            { type: String },
    constat:         { type: String },
    rapports:        { type: String },
    autoritePV:      { type: String },
    numeroPV:        { type: String },
    datePV:          { type: Date },
    degatMateriel:   { type: Boolean, default: false },
    degatCorporel:   { type: Boolean, default: false },
    degatMortel:     { type: Boolean, default: false },
    montant: { type: Number }, // total (auto-computed or stored directly)
    statut: {
      type: String,
      enum: ['valide', 'expire', 'en_cours', 'suspendu'],
      default: 'valide',
    },
    document: { type: String }, // file URL
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

AdministratifSchema.index({ agencyId: 1, type: 1 });

module.exports = mongoose.model('Administratif', AdministratifSchema);
