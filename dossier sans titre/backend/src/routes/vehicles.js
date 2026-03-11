const Vehicle = require('../models/Vehicle');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Vehicle);
