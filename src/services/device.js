import db from '../db';

/**
 * @description The service function that gets all devices belonging to a user
 * @param {Object} data data required
 * @param {String} data.deviceId The id of the device been requested for
 * @param {Object} data.user The user details
 * @param {String} data.userType The type of user making the request
 * @param {function} log Logger utility for logging messages
 * @returns {Object} The updated user data
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getSingleDevice = async (data, log) => {
  const { deviceId, user, userType } = data;
  log.debug('Executing getSingleDevice service');
  try {
    log.debug('Gathering filter parameters for getting device');
    const deviceMatch = {
      _id: deviceId,
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      wardId: userType === 'ward_user' ? user._id : user.wardId,
    };
    const purifyDeviceMatch = JSON.parse(JSON.stringify(deviceMatch));
    log.debug('Fetching device from database using filter parameters');
    const device = await db.device.getSingleDevice(purifyDeviceMatch);
    log.debug('Returning device to user');
    return device;
  } catch (err) {
    log.debug('Unable to get device. throwing error');
    const error = new Error(`Unable to get device with id: ${deviceId}`);
    error.httpStatusCode = 404;
    throw error;
  }
};

/**
 * @description The service function that gets all devices belonging to a user
 * @param {Object} data The data required
 * @param {Object} data.user The user making the request
 * @param {String} data.userType The type of user making the request
 * @param {function} log Logger utility for logging messages
 * @returns {Object} The updated user data
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getAllDevice = async (data, log) => {
  const { user, userType } = data;
  try {
    log.debug('Gathering user details');
    const deviceMatch = {
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      wardId: userType === 'ward_user' ? user._id : user.wardId,
    };
    const purifyDeviceMatch = JSON.parse(JSON.stringify(deviceMatch));
    log.debug('Getting devices from the database using user details');
    const device = await db.device.getAllDevice(purifyDeviceMatch);
    log.debug('Sending devices to the user');
    return device;
  } catch (err) {
    log.debug('Unable to get devices. Returning an error with a status code');
    const error = new Error('Unable to get devices');
    error.httpStatusCode = 404;
    throw error;
  }
};

/**
 * @description The service function that updates a device
 * @param {Object} data The data required
 * @param {Object} data.user The user data
 * @param {String} data.deviceId the id of the device to be updated
 * @param {String} data.userType The type of user making the request
 * @param {String} data.label the new label of the device
 * @param {function} log Logger utility for logging messages
 * @returns {object} The updated device data
 * @throws {error} Any error that prevents the service from executing successfully
 */
const updateDevice = async (data, log) => {
  const {
    deviceId, user, userType, label,
  } = data;
  try {
    log.debug('Gathering filter to match device');
    const deviceMatch = {
      _id: deviceId,
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      wardId: userType === 'ward_user' ? user._id : user.wardId,
    };
    const purifyDeviceMatch = JSON.parse(JSON.stringify(deviceMatch));
    log.debug('Updating device info');
    const device = await db.device.updateDevice(
      purifyDeviceMatch, { label },
    );
    log.debug('Sending updated device to the user');
    return device;
  } catch (err) {
    log.debug('Unable to update device. Returning an error with a status code');
    const error = new Error('Unable to get devices');
    error.httpStatusCode = 404;
    throw error;
  }
};

export default { getSingleDevice, getAllDevice, updateDevice };
