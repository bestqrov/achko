const ContratLeasing = require('../models/ContratLeasing');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(ContratLeasing);
