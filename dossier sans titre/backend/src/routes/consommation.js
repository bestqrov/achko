const Consommation = require('../models/Consommation');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Consommation);
