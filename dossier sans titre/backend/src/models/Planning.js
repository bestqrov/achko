const mongoose = require('mongoose');

const PlanningSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    titre: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['mission', 'maintenance', 'entretien', 'formation', 'reunion', 'autre'],
      required: true,
    },
    // Date and time
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    heureDebut: { type: String },
    heureFin: { type: String },
    // Resources
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Location
    lieu: { type: String },
    destination: { type: String },
    // Status and tracking
    statut: {
      type: String,
      enum: ['planifie', 'confirme', 'en_cours', 'termine', 'annule'],
      default: 'planifie',
    },
    priorite: {
      type: String,
      enum: ['basse', 'normale', 'haute', 'urgente'],
      default: 'normale',
    },
    // Additional details
    coutEstime: { type: Number },
    notes: { type: String },
    rappel: { type: Boolean, default: false },
    rappelMinutes: { type: Number, default: 60 }, // minutes before event
    // Recurrence (for recurring events)
    recurrence: {
      type: { type: String, enum: ['quotidienne', 'hebdomadaire', 'mensuelle'] },
      intervalle: { type: Number, default: 1 },
      joursSemaine: [{ type: Number, min: 0, max: 6 }], // 0=Sunday, 6=Saturday
      dateFinRecurrence: { type: Date },
    },
    // For recurring events, link to parent
    parentEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Planning' },
  },
  { timestamps: true }
);

// Index for efficient queries
PlanningSchema.index({ agencyId: 1, dateDebut: 1, dateFin: 1 });
PlanningSchema.index({ vehicle: 1 });
PlanningSchema.index({ chauffeur: 1 });

module.exports = mongoose.model('Planning', PlanningSchema);