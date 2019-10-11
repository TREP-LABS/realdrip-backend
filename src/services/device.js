import db from '../db';

const getSingleDevice = async (deviceId, user) => {
  // eslint-disable-next-line no-underscore-dangle
  const _id = deviceId;
  const { hospitalId } = user;
  const { wardId } = user;

  try {
    // eslint-disable-next-line no-underscore-dangle
    const device = await db.device.getSingleDevice({ _id, hospitalId, wardId });
    return { device };
  } catch (err) {
    const error = new Error(`Unable to get device with id: ${deviceId}`);
    error.httpStatusCode = 404;
    throw error;
  }
};
module.exports = { getSingleDevice };
