const Facture = require('../models/Facture');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Facture);
