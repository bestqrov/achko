const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: {
      type: String,
      enum: ['intervention', 'diagnostique', 'entretien'],
      required: true,
    },
    titre: { type: String, required: true },
    description: { type: String },
    dateIntervention: { type: Date, required: true, default: Date.now },
    kilometrage: { type: Number },
    cout: { type: Number, default: 0 },
    prestataire: { type: String },
    statut: {
      type: String,
      enum: ['planifiée', 'en_cours', 'terminée', 'annulée'],
      default: 'planifiée',
    },
    piecesRemplacees: [{ nom: String, reference: String, cout: Number }],
    prochainEntretien: { type: Date },
    prochainKilometrage: { type: Number },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
