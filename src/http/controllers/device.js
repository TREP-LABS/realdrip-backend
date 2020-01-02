import deviceService from '../../services/device';
import catchControllerError from './helpers/catchControllerError';
import invalidReqeust from './helpers/invalidRequest';
import validate from '../validations/validate';
import * as schemas from '../validations/schemas/device';
import db from '../../db';

/**
 * @description Controller to get single device
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleDevice = catchControllerError('GetSingleDevice', async (req, res) => {
  const requestData = validate(schemas.getSingleDevice, req.params);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { user, userType, log } = res.locals;
  const device = await deviceService.getSingleDevice({ ...requestData, user, userType }, log);

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
 * @description An helper function to help check if a device label is already in use
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {Boolean} A truthy value representing if the label is already in use or not.
 */
const labelAlreadyExist = async (req, res) => {
  let { label } = req.body;
  const { user, userType } = res.locals;
  label = label.toLowerCase();
  const deviceMatch = {
    label,
    hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
  };
  const purifyDeviceMatch = JSON.parse(JSON.stringify(deviceMatch));
  const device = await db.device.getSingleDevice(purifyDeviceMatch);
  if (device) return true;
  return false;
};

/**
 * @description Controller for Update device API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateDevice = catchControllerError('UpdateDevice', async (req, res) => {
  const requestData = validate(schemas.updateDevice, { ...req.body, ...req.params });
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  if (requestData.label && await labelAlreadyExist(req, res)) {
    return res.status(400).json({ success: false, message: 'Label already in use. Try a different one' });
  }

  const { user, userType, log } = res.locals;
  const device = await deviceService.updateDevice({
    user, userType, ...requestData,
  }, log);
  if (!device) {
    return res.status(404).json({ success: false, message: 'Unable to update device' });
  }
  log.debug('updateDevice service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Device updated', data: device });
});

export default {
  updateDevice,
  getSingleDevice,
  getAllDevice,
};
