const EquipementVehicule = require('../models/EquipementVehicule');
const createCrudRouter   = require('./crudRouter');
module.exports           = createCrudRouter(EquipementVehicule);
