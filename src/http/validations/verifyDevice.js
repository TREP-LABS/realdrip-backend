import validator from 'validator';
import FieldErrors from './fieldErrors';

const verifyDevice = (req, res, next) => {
  const { deviceId } = req.body;

  const fieldErrors = new FieldErrors();

  if (deviceId == undefined || !deviceId || typeof (deviceId) !== 'string') fieldErrors.addError('deviceId', 'deviceId is a required string');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request body', errors: fieldErrors.errors });
  }
  return next();
};

export default {
  verifyDevice,
};
