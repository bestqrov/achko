const mongoose = require('mongoose');

const PieceSchema = new mongoose.Schema(
  {
    piece:    { type: String, required: true },
    quantite: { type: Number, required: true },
    unite:    { type: String, default: '' },
  },
  { _id: false }
);

const PlanEntretienSchema = new mongoose.Schema(
  {
    agencyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    nom:         { type: String, required: true },
    frequence:   { type: String },
    modele:      { type: String },
    flotte:      { type: String },
    commentaire: { type: String },
    pieces:      [PieceSchema],
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlanEntretien', PlanEntretienSchema);
