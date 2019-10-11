import deviceModel from './model';

/**
 * @description Gets a single device from the database
 * @param {object} deviceDetails  The data to be used as filter
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getSingleDevice = async (deviceDetails) => {
  const params = JSON.parse(JSON.stringify(deviceDetails));
  const Model = deviceModel;
  return Model.findOne(params);
};

/**
 * @description Creates a device in the database
 * @param {object} data  The device info to be added t0 the database
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const createDevice = async (data) => {
  const Model = deviceModel;
  return new Model(data).save();
};

export default {
  getSingleDevice,
  createDevice,
};
