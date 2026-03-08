const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    agencyId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },

    // Identification
    designation:     { type: String },
    immatricule:     { type: String },          // display plate (was matricule)
    matricule:       { type: String },          // kept for backward compat
    typeAcquisition: { type: String },
    nom:             { type: String },
    code:            { type: String },
    centreCout:      { type: String },
    numeroOrdre:     { type: String },
    carteGrise:      { type: String },
    numeroChassis:   { type: String },
    numeroW:         { type: String },
    couleur:         { type: String },
    codeCle:         { type: String },
    modele:          { type: String },

    // Dates / mileage
    dateMiseEnCirculation: { type: Date },
    datePrevueRestitution: { type: Date },
    kilometrageInitial:    { type: Number, default: 0 },
    indexeHoraireInitial:  { type: Number, default: 0 },

    // Media
    photoUrl:    { type: String },
    commentaire: { type: String },

    // Acquisition achat
    concessionnaire: { type: String },
    dateAchat:       { type: Date },
    numeroContrat:   { type: String },
    garantie:        { type: String },
    montantHT:       { type: Number, default: 0 },
    tva:             { type: Number, default: 20 },

    // Legacy / operational
    brand:  { type: String },
    model:  { type: String },
    year:   { type: Number },
    type:   { type: String, enum: ['car', 'truck', 'van', 'bus', 'motorcycle'], default: 'car' },
    fuel:   { type: String, enum: ['diesel', 'essence', 'electric', 'hybrid'], default: 'diesel' },
    status: { type: String, enum: ['available', 'in_use', 'maintenance', 'retired'], default: 'available' },
    mileage:       { type: Number, default: 0 },
    color:         { type: String },
    chassisNumber: { type: String },
    assignedDriver:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes:         { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
