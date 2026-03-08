/**
 * Generic CRUD route factory.
 * Usage: createCrudRouter(Model)
 */
const express = require('express');
const { protect, tenantIsolation, authorize } = require('../middleware/auth');
const createCrudController = require('../controllers/crudController');

const createCrudRouter = (Model, options = {}) => {
  const router = express.Router();
  const ctrl = createCrudController(Model);
  const { readRoles = [], writeRoles = ['admin', 'manager', 'superadmin'] } = options;

  router.use(protect, tenantIsolation);

  router.route('/')
    .get(ctrl.getAll)
    .post(ctrl.create);

  router.route('/:id')
    .get(ctrl.getOne)
    .put(ctrl.update)
    .delete(authorize(...writeRoles), ctrl.remove);

  return router;
};

module.exports = createCrudRouter;
