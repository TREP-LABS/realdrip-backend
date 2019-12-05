/**
 * @description Paginates a find request using mongoose model
 * @param {object} model  The mongoose model
 * @param {object} data contains request parameters and options
 * @param {string} data.query filter to match document in db
 * @param {string} data.select fields to be returned
 * @param {string} data.limit how many document to be returned
 * @param {string} data.page the page to be returned
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const skipPagination = async (model, data) => {
  const { query, select, limit } = data;
  let { page } = data;
  page = page > 0 ? page : 0;
  const result = await model.find(query).select(select).skip(page * limit).limit(limit);
  const count = await model.find(query).count();
  return {
    result,
    pagination: {
      page,
      pages: Math.ceil(count / limit),
    },
  };
};

const cursorPagination = async (model, data) => {
  const {
    query, select, limit, cursor,
  } = data;
  const lastItem = await model.find(query).select(select).limit(1);
  if (!cursor) {
    const items = await model.find(query).select(select).sort({ _id: -1 }).limit(limit);
    return {
      items,
      pagination: {
        next: items[items.length - 1]._id.equals(lastItem[0]._id)
          ? null : `?cursor=${items[items.length - 1]._id}`,
        previous: null,
      },
    };
  }
  const items = await model
    .find({ ...query, _id: { $lt: cursor } })
    .sort({ _id: -1 })
    .limit(limit);
  return {
    items,
    pagination: {
      next: items[items.length - 1]._id.equals(lastItem[0]._id)
        ? null : `?cursor=${items[items.length - 1]._id}`,
      previous: `?cursor=${cursor}`,
    },
  };
};
export default { skipPagination, cursorPagination };
