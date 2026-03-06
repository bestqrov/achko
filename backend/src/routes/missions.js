const Mission = require('../models/Mission');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(Mission);
