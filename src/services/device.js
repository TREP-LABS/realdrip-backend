import db from '../db';

const getSingleDevice = async (deviceId, user, userType) => {
  try {
    const deviceMatch = {
      // eslint-disable-next-line no-underscore-dangle
      _id: deviceId,
      // eslint-disable-next-line no-underscore-dangle
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      // eslint-disable-next-line no-underscore-dangle
      wardId: userType === 'ward_user' ? user._id : user.wardId,
    };

    const device = await db.device.getSingleDevice(deviceMatch);
    return { device };
  } catch (err) {
    const error = new Error(`Unable to get device with id: ${deviceId}`);
    error.httpStatusCode = 404;
    throw error;
  }
};
module.exports = { getSingleDevice };
