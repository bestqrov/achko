/**
 * Generic CRUD controller factory.
 * Generates controller methods scoped to agencyId.
 */
const createCrudService = require('../services/crudService');

const createCrudController = (Model) => {
  const service = createCrudService(Model);

  return {
    getAll: async (req, res, next) => {
      try {
        const result = await service.getAll(req.agencyId, req.query);
        res.status(200).json({ success: true, ...result });
      } catch (err) { next(err); }
    },

    getOne: async (req, res, next) => {
      try {
        const item = await service.getOne(req.agencyId, req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: item });
      } catch (err) { next(err); }
    },

    create: async (req, res, next) => {
      try {
        const item = await service.create(req.agencyId, req.user._id, req.body);
        res.status(201).json({ success: true, data: item });
      } catch (err) { next(err); }
    },

    update: async (req, res, next) => {
      try {
        const item = await service.update(req.agencyId, req.params.id, req.body);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: item });
      } catch (err) { next(err); }
    },

    remove: async (req, res, next) => {
      try {
        const item = await service.remove(req.agencyId, req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, message: 'Deleted successfully' });
      } catch (err) { next(err); }
    },
  };
};

module.exports = createCrudController;
