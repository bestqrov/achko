/**
 * Generic CRUD service factory for multi-tenant models.
 * All queries are automatically scoped to the agencyId.
 */
const createCrudService = (Model) => ({
  getAll: async (agencyId, query = {}) => {
    const { page = 1, limit = 20, sort = '-createdAt', ...filters } = query;
    const skip = (page - 1) * limit;
    const data = await Model.find({ agencyId, ...filters })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('vehicle', 'matricule brand model')
      .populate('driver', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');
    const total = await Model.countDocuments({ agencyId, ...filters });
    return { data, total, page: Number(page), pages: Math.ceil(total / limit) };
  },

  getOne: async (agencyId, id) => {
    return Model.findOne({ _id: id, agencyId });
  },

  create: async (agencyId, userId, body) => {
    return Model.create({ ...body, agencyId, createdBy: userId });
  },

  update: async (agencyId, id, body) => {
    return Model.findOneAndUpdate({ _id: id, agencyId }, body, {
      new: true,
      runValidators: true,
    });
  },

  remove: async (agencyId, id) => {
    return Model.findOneAndDelete({ _id: id, agencyId });
  },
});

module.exports = createCrudService;
