const mongoose = require('mongoose');

const ContratLeasingSchema = new mongoose.Schema(
  {
    agencyId:              { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
    vehicleId:             { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    numeroContrat:         { type: String, required: true },
    dateContrat:           { type: Date },
    concessionnaire:       { type: String, default: '' },
    datePremierPrelevement:{ type: Date },
    societeLesing:         { type: String, default: '' },
    dateFinContrat:        { type: Date },
    dureeContrat:          { type: Number, default: 0 },   // mois
    dateReception:         { type: Date },
    commentaire:           { type: String, default: '' },
    /* coûts */
    montantContratHT:      { type: Number, default: 0 },
    tva:                   { type: Number, default: 20 },
    montantContratTTC:     { type: Number, default: 0 },
    montantPrelevementHT:  { type: Number, default: 0 },
    montantPrelevementTTC: { type: Number, default: 0 },
    montantFinanceHT:      { type: Number, default: 0 },
    montantFinanceTTC:     { type: Number, default: 0 },
    valeurResiduelleHT:    { type: Number, default: 0 },
    valeurResiduelleTTC:   { type: Number, default: 0 },
    dureeReport:           { type: Number, default: 0 },   // mois
    /* avenant */
    avenantPrelevementHT:  { type: Number, default: 0 },
    avenantPrelevementTTC: { type: Number, default: 0 },
    avenantDateDebut:      { type: Date },
    avenantDateFin:        { type: Date },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContratLeasing', ContratLeasingSchema);
