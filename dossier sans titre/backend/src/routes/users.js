const User = require('../models/User');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(User);
