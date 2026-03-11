const PlanEntretien = require('../models/PlanEntretien');
const createCrudRouter = require('./crudRouter');
module.exports = createCrudRouter(PlanEntretien);
