const mongoose = require('mongoose');

const VehiculeRemplacementSchema = new mongoose.Schema(
  {
    agencyId:            { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    /* identification */
    dateDemande:         { type: Date },
    vehiculeRemplacement:{ type: String, default: '' },
    contrat:             { type: String, default: '' },
    sinistre:            { type: String, default: '' },
    /* période */
    dateDebut:           { type: Date },
    dateFinPrevue:       { type: Date },
    dateRestitution:     { type: Date },
    /* détails */
    marqueType:          { type: String, default: '' },
    modeFormule:         { type: String, default: '' },
    /* kilométrage */
    kilometrageDepart:   { type: Number, default: 0 },
    kilometrageRetour:   { type: Number, default: 0 },
    distance:            { type: Number, default: 0 },
    /* lieux */
    lieuDepart:          { type: String, default: '' },
    lieuArrivee:         { type: String, default: '' },
    /* carburant */
    carburantDebut:      { type: String, default: '0' },
    carburantFin:        { type: String, default: '0' },
    /* autres */
    motif:               { type: String, default: '' },
    attachement:         { type: String, default: '' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VehiculeRemplacement', VehiculeRemplacementSchema);
