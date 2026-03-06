const Gestion = require('../models/Gestion');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Gestion);
