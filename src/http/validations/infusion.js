import FieldErrors from './fieldErrors';
import db from '../../db';

const createInfusion = (req, res, next) => {
  const {
    patientName, doctorsInstruction, startVolume, stopVolume, deviceId,
  } = req.body;
  const fieldErrors = new FieldErrors();

  if (!patientName || typeof (patientName) !== 'string') fieldErrors.addError('patientName', 'patientName is a required string');
  if (!doctorsInstruction || typeof (doctorsInstruction) !== 'string') fieldErrors.addError('doctorsInstruction', 'doctorsInstruction is a required string');
  if (!startVolume || typeof (startVolume) !== 'number') fieldErrors.addError('startVolume', 'startVolume is a required number');
  if (!stopVolume || typeof (stopVolume) !== 'number') fieldErrors.addError('stopVolume', 'stopVolume is a required number');
  if (!deviceId || typeof (deviceId) !== 'string') fieldErrors.addError('deviceId', 'deviceId is required');
  else if (!db.validResourceId(deviceId)) fieldErrors.addError('deviceId', 'Invalid deviceId');
  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

const validateInfusionId = (req, res, next) => {
  const { infusionId } = req.params;

  const fieldErrors = new FieldErrors();

  if (!db.validResourceId(infusionId)) fieldErrors.addError('infusionId', 'infusionId is not valid');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

const updateInfusion = (req, res, next) => {
  const { infusionId } = req.params;
  const {
    patientName, doctorsInstruction, startVolume, stopVolume,
  } = req.body;
  const fieldErrors = new FieldErrors();

  if (!db.validResourceId(infusionId)) fieldErrors.addError('infusionId', 'infusionId is not valid');

  if (patientName) {
    if (typeof (patientName) !== 'string') fieldErrors.addError('patientName', 'patientName is a required string');
  }
  if (doctorsInstruction) {
    if (typeof (doctorsInstruction) !== 'string') fieldErrors.addError('doctorsInstruction', 'doctorsInstruction is a required string');
  }
  if (startVolume) {
    if (typeof (startVolume) !== 'number') fieldErrors.addError('startVolume', 'startVolume is a required number');
  }
  if (stopVolume) {
    if (typeof (stopVolume) !== 'number') fieldErrors.addError('stopVolume', 'stopVolume is a required number');
  }
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid request: All fields can\'t be empty' });
  }
  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

export default { createInfusion, validateInfusionId, updateInfusion };
