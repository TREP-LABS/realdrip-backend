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
  const { label, wardId, hospitalId } = req.body;

  const fieldErrors = new FieldErrors();
  if (label) {
    if (typeof (label) !== 'string') fieldErrors.addError('label', 'label is a string');
  }
  if (wardId) {
    if (!db.validResourceId(wardId)) fieldErrors.addError('wardId', 'wardId is not valid');
  }
  if (hospitalId) {
    if (!db.validResourceId(hospitalId)) fieldErrors.addError('hospitalId', 'hospitalId is not valid');
  }
  if (!deviceId) fieldErrors.addError('deviceId', 'deviceId is required');
  if (!db.validResourceId(deviceId)) fieldErrors.addError('deviceId', 'deviceId is not valid');

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid request: All fields can\'t be empty' });
  }

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

export default { getSingleDevice, updateDevice };
