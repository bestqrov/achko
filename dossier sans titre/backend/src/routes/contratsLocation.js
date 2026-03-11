const ContratLocation = require('../models/ContratLocation');
const createCrudRouter  = require('./crudRouter');
module.exports           = createCrudRouter(ContratLocation);
