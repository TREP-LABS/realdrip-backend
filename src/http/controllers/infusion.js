import infusionService from '../../services/infusion';
import infusionValidation from '../validations/infusion';

/**
 * @description Controller to create infusion
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createInfusion = async (req, res) => {
  const {
    patientName, doctorsInstruction, startVolume, stopVolume, deviceId,
  } = req.body;
  const { user, userType, log } = res.locals;
  log.debug('Executing the createInfusion controller');
  try {
    const infusion = await infusionService.createInfusion({
      startVolume,
      stopVolume,
      patientName,
      doctorsInstruction,
      deviceId,
      user,
      userType,
    }, log);
    log.debug('createInfusion service executed without error, sending back a success response');
    return res.status(201).json({ success: true, message: 'Infusion created', data: infusion });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('createInfusion service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'createInfusion service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error creating Infusion' });
  }
};

/**
 * @description Controller to delete infusion
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const deleteInfusion = async (req, res) => {
  const { infusionId } = req.params;
  const { user, userType, log } = res.locals;
  log.debug('Executing the deleteInfusion controller');
  try {
    const infusion = await infusionService.deleteInfusion({ infusionId, user, userType }, log);
    log.debug('deleteInfusion service executed without error, sending back a success response');
    return res.status(204).json({ success: true, message: 'Infusion deleted', data: infusion });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('deleteInfusion service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'deleteInfusion service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error deleting Infusion' });
  }
};

export default {
  createInfusion: [infusionValidation.createInfusion, createInfusion],
  deleteInfusion: [infusionValidation.deleteInfusion, deleteInfusion],
};
