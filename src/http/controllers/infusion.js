import infusionService from '../../services/infusion';
import infusionValidation from '../validations/infusion';

/**
 * @description Controller to create infusion
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createInfusion = async (req, res, next) => {
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
    return next(err);
  }
};

/**
 * @description Controller for "get All Infusion" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllInfusion = async (req, res, next) => {
  const { user, userType, log } = res.locals;
  log.debug('Executing the getAllInfusion controller');
  try {
    const infusions = await infusionService.getAllInfusion({ user, userType }, log);
    log.debug('getAllInfusion service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Infusions found', data: infusions });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('getAllInfusion service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

/**
 * @description Controller for "get Single Infusion" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleInfusion = async (req, res, next) => {
  const { infusionId } = req.params;
  const { user, userType, log } = res.locals;
  log.debug('Executing the getSingleInfusion controller');
  try {
    const infusion = await infusionService.getSingleInfusion({ infusionId, user, userType }, log);
    if (!infusion) {
      return res.status(404).json({ success: false, message: 'Infusion not found' });
    }
    log.debug('getSingleInfusion service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Infusion found', data: infusion });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('getSingleInfusion service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

/**
 * @description Controller for "update Infusion" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateInfusion = async (req, res, next) => {
  const {
    patientName, doctorsInstruction, startVolume, stopVolume,
  } = req.body;
  const { infusionId } = req.params;
  const { user, userType, log } = res.locals;
  log.debug('Executing the updateInfusion controller');
  try {
    const infusion = await infusionService.updateInfusion({
      infusionId, user, userType, patientName, doctorsInstruction, startVolume, stopVolume,
    }, log);
    if (!infusion) {
      return res.status(404).json({ success: false, message: 'Infusion not found' });
    }
    log.debug('updateInfusion service executed without error, sending back a success response.');
    return res.status(200).json({ success: true, message: 'Infusion updated', data: infusion });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('updateInfusion service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

/**
 * @description Controller to delete infusion
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const deleteInfusion = async (req, res, next) => {
  const { infusionId } = req.params;
  const { user, userType, log } = res.locals;
  log.debug('Executing the deleteInfusion controller');
  try {
    await infusionService.deleteInfusion({ infusionId, user, userType }, log);
    log.debug('deleteInfusion service executed without error, sending back a success response');
    return res.status(204).json({});
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('deleteInfusion service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return next(err);
  }
};

export default {
  createInfusion: [infusionValidation.createInfusion, createInfusion],
  getSingleInfusion: [infusionValidation.validateInfusionId, getSingleInfusion],
  getAllInfusion,
  updateInfusion: [infusionValidation.updateInfusion, updateInfusion],
  deleteInfusion: [infusionValidation.validateInfusionId, deleteInfusion],
};
