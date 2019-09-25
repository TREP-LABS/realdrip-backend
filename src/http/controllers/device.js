import verifyDeviceService from '../../services/verifyDevice';
import deviceValidation from '../validations/verifyDevice';

const verifyDevice = async (req, res) => {
  const { deviceId } = req.body;
  try {
    const deviceExists = await verifyDeviceService.verify(deviceId);
    return res.status(201).json({ success: true, message: 'Device verified successfully', data: deviceExists });
  } catch (err) {
    if (err.httpStatusCode) {
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Error verifying device' });
  }
};
module.exports = { verifyDevice: [deviceValidation.verifyDevice, verifyDevice] };
