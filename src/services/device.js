import db from '../db';

const verify = async (deviceId) => {
  const device = await db.device.getDevice(deviceId);
  if (device.exists()) {
    return {deviceId: deviceId};
  }else {
    const error = new Error('device with id: '+deviceId+' was not found');
    error.httpStatusCode = 404;
    throw error;
  }
};
module.exports = { verify };
