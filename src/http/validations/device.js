import FieldErrors from './fieldErrors';

const getSingleDevice = (req, res, next) => {
  const { deviceId } = req.params;

  const fieldErrors = new FieldErrors();

  if (!deviceId || typeof (deviceId) !== 'string') fieldErrors.addError('deviceId', 'deviceId is a required string');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

export default {
  getSingleDevice,
};
