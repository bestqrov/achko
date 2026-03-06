const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    reference: { type: String, required: true },
    client: { type: String },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    depart: { type: String, required: true },
    destination: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    dateArrivee: { type: Date },
    kmDepart: { type: Number },
    kmArrivee: { type: Number },
    statut: { type: String, enum: ['planifié', 'en_cours', 'terminé', 'annulé'], default: 'planifié' },
    type: { type: String, enum: ['local', 'regional', 'international'], default: 'local' },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', TripSchema);
