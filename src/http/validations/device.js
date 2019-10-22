import FieldErrors from './fieldErrors';
import db from '../../db';

const getSingleDevice = (req, res, next) => {
  const { deviceId } = req.params;

  const fieldErrors = new FieldErrors();

  if (!deviceId || typeof (deviceId) !== 'string') fieldErrors.addError('deviceId', 'deviceId is a required string');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

const updateDevice = (req, res, next) => {
  const { deviceId } = req.params;

  const fieldErrors = new FieldErrors();

  if (!db.validResourceId(deviceId)) fieldErrors.addError('deviceId', 'deviceId should be a ');
  if (!deviceId || typeof (deviceId) !== 'string') fieldErrors.addError('deviceId', 'deviceId is a required string');
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) fieldErrors.addError('request', 'Request body can\'t be empty');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

export default { getSingleDevice, updateDevice };
