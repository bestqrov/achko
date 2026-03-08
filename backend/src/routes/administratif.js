const Administratif = require('../models/Administratif');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Administratif);
