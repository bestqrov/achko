const Maintenance = require('../models/Maintenance');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Maintenance);
