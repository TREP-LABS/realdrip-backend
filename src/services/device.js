import db from '../db';

const getSingleDevice = async (deviceId, user, userType, log) => {
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

const getAllDevice = async (user, userType, log) => {
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
export default { getSingleDevice, getAllDevice };
