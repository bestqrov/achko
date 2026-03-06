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
    dateEmission: { type: Date },
    dateExpiration: { type: Date },
    organisme: { type: String },
    montant: { type: Number },
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
