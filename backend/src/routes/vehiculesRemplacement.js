const VehiculeRemplacement = require('../models/VehiculeRemplacement');
const createCrudRouter     = require('./crudRouter');
module.exports             = createCrudRouter(VehiculeRemplacement);
