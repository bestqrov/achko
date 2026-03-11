const mongoose = require('mongoose');

const ContratLocationSchema = new mongoose.Schema(
  {
    agencyId:             { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:            { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    /* identification */
    fournisseur:          { type: String, default: '' },
    numeroContrat:        { type: String, default: '' },
    typeContrat:          { type: String, default: '' },
    commentaire:          { type: String, default: '' },
    /* informations générales */
    dateDebut:            { type: Date },
    dateFinPrevue:        { type: Date },
    dateFinReelle:        { type: Date },
    montantFranchise:     { type: Number, default: 0 },
    dureePrevue:          { type: Number, default: 0 },   // mois
    dureeReelle:          { type: Number, default: 0 },   // mois
    loyerMensuelHT:       { type: Number, default: 0 },
    tva:                  { type: Number, default: 20 },
    loyerMensuelTTC:      { type: Number, default: 0 },
    prixKmSupp:           { type: Number, default: 0 },
    /* kilométrage & carburant */
    kilometrageDebut:     { type: Number, default: 0 },
    kilometrageFin:       { type: Number, default: 0 },
    kilometrageParcouru:  { type: Number, default: 0 },
    carburantDebut:       { type: Number, default: 0 },   // %
    carburantFin:         { type: Number, default: 0 },
    carburantConsomme:    { type: Number, default: 0 },
    plafondKilometrique:  { type: Number, default: 0 },
    plafondPneumatique:   { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContratLocation', ContratLocationSchema);
