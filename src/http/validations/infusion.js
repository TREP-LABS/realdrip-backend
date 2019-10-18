import FieldErrors from './fieldErrors';

const createInfusion = (req, res, next) => {
  const {
    patientName, doctorsInstruction, startVolume, stopVolume, deviceId,
  } = req.body;
  const fieldErrors = new FieldErrors();

  if (!patientName || typeof (patientName) !== 'string') fieldErrors.addError('patientName', 'patientName is required');
  if (!doctorsInstruction || typeof (doctorsInstruction) !== 'string') fieldErrors.addError('doctorsInstruction', 'doctorsInstruction is required');
  if (!startVolume) fieldErrors.addError('startVolume', 'startVolume is required');
  if (!stopVolume) fieldErrors.addError('stopVolume', 'stopVolume is required');
  if (!deviceId || typeof (deviceId) !== 'string') fieldErrors.addError('deviceId', 'deviceId is required');
  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

const getSingleInfusion = (req, res, next) => {
  const { infusionId } = req.params;

  const fieldErrors = new FieldErrors();

  if (!infusionId || typeof (infusionId) !== 'string') fieldErrors.addError('infusionId', 'infusionId is required');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

const updateInfusion = (req, res, next) => {
  const { infusionId } = req.params;

  const fieldErrors = new FieldErrors();

  if (!infusionId || typeof (infusionId) !== 'string') fieldErrors.addError('infusionId', 'infusionId is a required string');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

export default { createInfusion, getSingleInfusion, updateInfusion };
