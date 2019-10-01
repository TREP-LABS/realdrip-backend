import FieldErrors from './fieldErrors';

const verifyDeviceId = (req, res, next) => {
  const { deviceId } = req.body;

  const fieldErrors = new FieldErrors();

  if (!deviceId || typeof (deviceId) !== 'string') fieldErrors.addError('deviceId', 'deviceId is a required string');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request body', errors: fieldErrors.errors });
  }
  return next();
};

export default {
  verifyDeviceId,
};
