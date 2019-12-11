import deviceModel from './model';

/**
 * @description Gets a single device from the database
 * @param {object} deviceMatch  The data to be used as filter for getting device
 * @param {string} deviceMatch._id The unique id of the device
 * @param {string} deviceMatch.hospitalId The hospital id associated with the device
 * @param {string} deviceMatch.wardId The ward id associated with the device
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getSingleDevice = async (deviceMatch) => {
  const Model = deviceModel;
  return Model.findOne(deviceMatch).select('-__v');
};

/**
 * @description Gets all devices matching the query parameter
 * @param {object} deviceMatch  The data to be used as filter for getting all devices
 * @param {string} deviceMatch.hospitalId The hospitalId id associated with the device
 * @param {string} deviceMatch.wardId The ward id associated with the device
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getAllDevice = async (deviceMatch) => {
  const Model = deviceModel;
  return Model.find(deviceMatch).select('-__v');
};

/**
 * @description Creates a device in the database
 * @param {object} data  The device info to be added to the database
 * @param {string} data.hospitalId The hospital Id to be associated with the device
 * @param {string} data.wardId The ward Id to be associated with the device
 * @param {string} data.label The label of the device
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const createDevice = async (data) => {
  const Model = deviceModel;
  return new Model(data).save();
};

const insertManyDevice = async (data) => {
  const Model = deviceModel;
  return Model.insertMany(data);

}

/**
 * @description Updates device data in the database
 * @param {object} deviceMatch An object describing how to select the device to be udpated
 * @param {string} [deviceMatch._id] The unique id of the device
 * @param {string} [deviceMatch.hospitalId] The hospitalId of the device
 * @param {string} [deviceMatch.wardId] The wardId of the device
 * @param {object} update The data to patch with the existing device data
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const updateDevice = async (deviceMatch, update) => {
  const Model = deviceModel;
  return Model.findOneAndUpdate(deviceMatch, update, { new: true });
};

export default {
  insertManyDevice,
  getSingleDevice,
  getAllDevice,
  createDevice,
  updateDevice,
};
