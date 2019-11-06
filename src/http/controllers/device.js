import deviceService from '../../services/device';
import deviceValidation from '../validations/device';

/**
 * @description Controller to get single device
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleDevice = async (req, res, next) => {
  const { deviceId } = req.params;
  const { user, userType, log } = res.locals;
  log.debug('Executing the getSingleDevice controller');
  try {
    const device = await deviceService.getSingleDevice({ deviceId, user, userType }, log);
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
    return next(err);
  }
};

/**
 * @description Controller to get all devices
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllDevice = async (req, res, next) => {
  const { user, userType, log } = res.locals;
  log.debug('Executing the getAllDevice controller');
  try {
    const devices = await deviceService.getAllDevice({ user, userType }, log);
    log.debug('getAllDevice service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Devices found', data: devices });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('getAllDevice service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

/**
 * @description Controller for Update device API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateDevice = async (req, res, next) => {
  const { label } = req.body;
  const { deviceId } = req.params;
  const { user, userType, log } = res.locals;
  log.debug('Executing the updateDevice controller');
  try {
    const device = await deviceService.updateDevice({
      deviceId, user, userType, label,
    }, log);
    if (!device) {
      return res.status(404).json({ success: false, message: 'Unable to update device' });
    }
    log.debug('updateDevice service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Device updated', data: device });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('updateDevice service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

export default {
  updateDevice: [deviceValidation.updateDevice, updateDevice],
  getSingleDevice: [deviceValidation.getSingleDevice, getSingleDevice],
  getAllDevice,
};
