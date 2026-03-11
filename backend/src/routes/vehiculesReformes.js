const VehiculeReforme  = require('../models/VehiculeReforme');
const createCrudRouter = require('./crudRouter');
module.exports         = createCrudRouter(VehiculeReforme);
