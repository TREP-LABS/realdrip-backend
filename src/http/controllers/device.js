import deviceService from '../../services/verify';
import deviceValidation from '../validations/verifyDevice';

const verifyDevice = async (req, res) => {
  const { deviceId } = req.body;
  const verification = await deviceService.verify(deviceId);
  if (verification.status === 201) {
    return res.status(201).json({
      success: true,
      message: 'Device verified successfully',
      data: {
        deviceId: deviceId
      }
    });
  }
  if (verification.status === 404) {
    return res.status(422).json({
      success: false,
      message: 'Invalid device Id',
      data: {
        deviceId: deviceId
      }
    });
  }
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: {
      deviceId: deviceId
    }
  });
};
module.exports = { verifyDevice: [deviceValidation.verifyDevice, verifyDevice] };
