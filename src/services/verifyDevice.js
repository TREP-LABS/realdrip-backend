import db from '../db';

const verify = async (deviceId) => {
  const device = await db.verifyDevice.getDevice(deviceId);
  if (device.exists()) {
    return {deviceId: deviceId};
  }else {
    const error = new Error('device with id: '+deviceId+' was not found');
    error.httpStatusCode = 422;
    throw error;
  }
};
module.exports = { verify };
