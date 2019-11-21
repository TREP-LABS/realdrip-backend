import deviceService from '../../services/device';
import deviceValidation from '../validations/device';
import catchControllerError from './catchControllerError';

/**
 * @description Controller to get single device
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleDevice = catchControllerError('GetSingleDevice', async (req, res) => {
  const { deviceId } = req.params;
  const { user, userType, log } = res.locals;
  const device = await deviceService.getSingleDevice({ deviceId, user, userType }, log);
  if (!device) {
    return res.status(404).json({ success: false, message: 'Device not found' });
  }
  log.debug('getSingleDevice service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Device found', data: device });
});

/**
 * @description Controller to get all devices
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllDevice = catchControllerError('GetAllDevice', async (req, res) => {
  const { user, userType, log } = res.locals;
  const devices = await deviceService.getAllDevice({ user, userType }, log);
  log.debug('getAllDevice service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Devices found', data: devices });
});

/**
 * @description Controller for Update device API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateDevice = catchControllerError('UpdateDevice', async (req, res) => {
  const { label } = req.body;
  const { deviceId } = req.params;
  const { user, userType, log } = res.locals;
  const device = await deviceService.updateDevice({
    deviceId, user, userType, label,
  }, log);
  if (!device) {
    return res.status(404).json({ success: false, message: 'Unable to update device' });
  }
  log.debug('updateDevice service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Device updated', data: device });
});

export default {
  updateDevice: [deviceValidation.updateDevice, updateDevice],
  getSingleDevice: [deviceValidation.getSingleDevice, getSingleDevice],
  getAllDevice,
};
