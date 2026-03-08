const IndexeHoraire = require('../models/IndexeHoraire');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(IndexeHoraire);
