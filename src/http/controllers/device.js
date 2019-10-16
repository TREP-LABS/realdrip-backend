import deviceService from '../../services/device';
import deviceValidation from '../validations/device';

/**
 * @description Controller for "update admin user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleDevice = async (req, res) => {
  const { deviceId } = req.params;
  const { user, userType, log } = res.locals;
  log.debug('Executing the getSingleDevice controller');
  try {
    const device = await deviceService.getSingleDevice(deviceId, user, userType, log);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    log.debug('getSingleDevice service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Device found', data: device });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('getSingleDevie service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'getSingleDevice service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error getting device' });
  }
};

/**
 * @description Controller for "update admin user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllDevice = async (req, res) => {
  const { user, userType, log } = res.locals;
  log.debug('Executing the getAllDevice controller');
  try {
    const device = await deviceService.getAllDevice(user, userType, log);
    log.debug('getAllDevice service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Devices found', data: device });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('getAllDevice service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'getAllDevice service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error getting device' });
  }
};

export default {
  getSingleDevice: [deviceValidation.getSingleDevice, getSingleDevice],
  getAllDevice,
};
