import deviceService from '../../services/deviceServices/verify';

const verifyDevice = async (req, res) => {
  const { deviceId } = req.body;
  const verification = await deviceService.verify(deviceId);
  if (verification.status === 204) {
    return res.status(422).json({
      status: false,
      message: 'DeviceId already verified',
    });
  } if (verification.status === 201) {
    return res.status(201).json({
      status: false,
      message: 'Device verified successfully',
    });
  } if (verification.status === 404) {
    return res.status(422).json({
      status: false,
      message: 'Invalid device Id',
    });
  }
  return res.status(500).json({
    status: false,
    message: 'Internal server error',
  });
};
module.exports = { verifyDevice };
