const Depense = require('../models/Depense');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Depense);