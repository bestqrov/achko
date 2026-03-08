const Trip = require('../models/Trip');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Trip);
