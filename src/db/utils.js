/**
 * @description Extend a mongoose query by chaining one or more
 * populate method call to populate refrenced fields
 * @param {Object} query The query to extend
 * @param {Array} fields An array of field names to populate
 * @returns {Object} The extended query
 */
export const populate = (query, fields) => {
  // Throw an error if the query does not support populating
  if (!query.populate) {
    throw Error('The query given does not support population');
  }
  if (!Array.isArray(fields)) {
    throw Error('Populate fields must be an array');
  }
  fields.forEach((field) => {
    // eslint-disable-next-line no-param-reassign
    query = query.populate(field);
  });
  return query;
};

export const select = () => {};
