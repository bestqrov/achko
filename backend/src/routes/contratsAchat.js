const ContratAchat   = require('../models/ContratAchat');
const createCrudRouter = require('./crudRouter');
module.exports         = createCrudRouter(ContratAchat);
