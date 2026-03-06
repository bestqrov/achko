const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    reference: { type: String, required: true },
    titre: { type: String, required: true },
    description: { type: String },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    depart: { type: String, required: true },
    destination: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    dateRetour: { type: Date },
    statut: {
      type: String,
      enum: ['planifiée', 'en_cours', 'terminée', 'annulée'],
      default: 'planifiée',
    },
    distance: { type: Number },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

MissionSchema.index({ agencyId: 1 });

module.exports = mongoose.model('Mission', MissionSchema);
