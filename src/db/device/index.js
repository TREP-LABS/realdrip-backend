import deviceModel from './model';

/**
 * @description Gets a single device from the database
<<<<<<< HEAD
 * @param {object} deviceMatch  The data to be used as filter for getting device
 * @param {string} deviceMatch._id The unique id of the device
 * @param {string} deviceMatch.hospitalId The hospital id associated with the device
 * @param {string} deviceMatch.wardId The ward id associated with the device
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getSingleDevice = async (deviceMatch) => {
  const Model = deviceModel;
  return Model.findOne(deviceMatch);
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
  return Model.find(deviceMatch);
=======
 * @param {object} deviceMatch  The data to be used as filter
 * @param {string} deviceMatch._id
 * @param {string} deviceMatch.hospitalId
 * @param {string} deviceMatch.wardId
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getSingleDevice = async (deviceMatch) => {
  const Model = deviceModel;
  return Model.findOne(deviceMatch);
>>>>>>> UPDATE did a rebase and fix review issues and merge conflict
};

/**
 * @description Gets all devices matching the query parameter
 * @param {object} deviceMatch  The data to be used as filter for getting all devices
 * @param {string} deviceMatch.hospitalId The hospitalId will used as the filter
 * if the hospital_admin request for a device
 * @param {string} deviceMatch.wardId if the ward or nurse requests for a device
 *  then both the hospitalId and the wardId will be used as filters
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getAllDevice = async (deviceMatch) => {
  const Model = deviceModel;
  return Model.find(deviceMatch);
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

export default {
  getSingleDevice,
  getAllDevice,
  createDevice,
};
