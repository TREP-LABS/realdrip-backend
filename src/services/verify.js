import db from '../db';

const verify = async (deviceId) => {
  const device = await db.verifyDevice.getDevice(deviceId);
  if (device.exists()) {
    await db.verifyDevice.createVerifyDevice({
      deviceId: deviceId,
      userId: '5',
      dateVerified: Date.now(),
    });
    return { status: 201 };
  } else {
    return { status: 404 };
  }
};
module.exports = { verify };
