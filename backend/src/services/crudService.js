/**
 * Generic CRUD service factory for multi-tenant models.
 * All queries are automatically scoped to the agencyId.
 */
const createCrudService = (Model) => ({
  getAll: async (agencyId, query = {}) => {
    const { page = 1, limit = 20, sort = '-createdAt', ...filters } = query;
    const skip = (page - 1) * limit;

    let q = Model.find({ agencyId, ...filters })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // only populate fields that actually exist on the schema
    if (Model.schema.path('vehicle')) {
      q = q.populate('vehicle', 'matricule brand model');
    }
    if (Model.schema.path('driver')) {
      q = q.populate('driver', 'firstName lastName');
    }
    if (Model.schema.path('createdBy')) {
      q = q.populate('createdBy', 'firstName lastName');
    }

    const data = await q;
    const total = await Model.countDocuments({ agencyId, ...filters });
    return { data, total, page: Number(page), pages: Math.ceil(total / limit) };
  },

  getOne: async (agencyId, id) => {
    let q = Model.findOne({ _id: id, agencyId });
    if (Model.schema.path('vehicle')) {
      q = q.populate('vehicle', 'matricule brand model');
    }
    if (Model.schema.path('driver')) {
      q = q.populate('driver', 'firstName lastName');
    }
    if (Model.schema.path('createdBy')) {
      q = q.populate('createdBy', 'firstName lastName');
    }
    return q;
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
