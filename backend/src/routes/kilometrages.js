const Kilometrage = require('../models/Kilometrage');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Kilometrage);
