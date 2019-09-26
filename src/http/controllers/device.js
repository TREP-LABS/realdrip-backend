import deviceService from '../../services/device';
import deviceValidation from '../validations/device';

const verifyDevice = async (req, res) => {
  const { deviceId } = req.body;
  try {
    await deviceService.verify(deviceId);
    return res.status(204).json({ success: true });
  } catch (err) {
    if (err.httpStatusCode) {
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Error verifying device' });
  }
};
module.exports = { verifyDevice: [deviceValidation.verifyDeviceId, verifyDevice] };
