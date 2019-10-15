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
    log.debug('Fetching device from database using filter parameters');
    const device = await db.device.getSingleDevice(deviceMatch);
    log.debug('Returning device to user');
    return device;
  } catch (err) {
    log.debug('Unable to get device. throwing error');
    const error = new Error(`Unable to get device with id: ${deviceId}`);
    error.httpStatusCode = 404;
    throw error;
  }
};
export default { getSingleDevice };
