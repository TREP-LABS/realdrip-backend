import deviceService from '../../services/device';
import deviceValidation from '../validations/device';

const getSingleDevice = async (req, res) => {
  const { deviceId } = req.params;
  const { user, userType } = res.locals;

  try {
    const device = await deviceService.getSingleDevice(deviceId, user, userType);
    return res.status(200).json({ success: true, message: 'Device found', data: device });
  } catch (err) {
    if (err.httpStatusCode) {
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Error getting device' });
  }
};

export default {
  getSingleDevice: [deviceValidation.getSingleDevice, getSingleDevice],
};
