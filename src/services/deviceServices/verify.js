import deviceModel from '../../db/deviceModel';

const verify = async (deviceId) => {
  const device = await deviceModel.getDevice(deviceId);
  if (device.exists()) {
    const alreadyVerified = await deviceModel.read('verifiedDevices', { deviceId });
    if (alreadyVerified.length >= 1) {
      return { status: 204 };
    }
    await deviceModel.create('verifiedDevices', [{
      deviceId,
      verified_by: 'admin',
      date_verified: Date.now(),
    }]);
    return { status: 201 };
  }
  return { status: 404 };
};
module.exports = { verify };
