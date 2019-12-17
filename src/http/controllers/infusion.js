import infusionService from '../../services/infusion';
import catchControllerError from './helpers/catchControllerError';
import invalidReqeust from './helpers/invalidRequest';
import validate from '../validations/validate';
import * as schemas from '../validations/schemas/infusion';

/**
 * @description Get the list of fields to be populated by refrence
 * @param {String} populateQueryParams The value of "populate" query parameters
 * @returns {Array} A list of fields to be populated
 */
const getPopulateFields = (populateQueryParams) => {
  if (typeof populateQueryParams !== 'string') return [];
  return populateQueryParams.split(',');
};

/**
 * @description Controller to create infusion
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createInfusion = catchControllerError('CreateInfusion', async (req, res) => {
  const requestData = validate(schemas.createInfusion, req.body);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { user, userType, log } = res.locals;
  const infusion = await infusionService.createInfusion({
    ...requestData, user, userType,
  }, log);
  log.debug('createInfusion service executed without error, sending back a success response');
  return res.status(201).json({ success: true, message: 'Infusion created', data: infusion });
});

/**
 * @description Controller for "get All Infusion" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllInfusion = catchControllerError('GetAllInfusion', async (req, res) => {
  const { user, userType, log } = res.locals;
  const {
    status, deviceId, wardId, nurseId,
  } = req.query;
  const infusions = await infusionService.getAllInfusion(
    {
      // eslint-disable-next-line max-len
      status, deviceId, wardId, nurseId, user, userType, populateFields: getPopulateFields(req.query.populate),
    }, log,
  );
  log.debug('getAllInfusion service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Infusions found', data: infusions });
});

/**
 * @description Controller for "get Single Infusion" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleInfusion = catchControllerError('GetSingleInfusion', async (req, res) => {
  const requestData = validate(schemas.getSingleInfusion, req.params);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { user, userType, log } = res.locals;
  const infusion = await infusionService.getSingleInfusion({
    ...requestData, user, userType, populateFields: getPopulateFields(req.query.populate),
  }, log);
  if (!infusion) {
    return res.status(404).json({ success: false, message: 'Infusion not found' });
  }
  log.debug('getSingleInfusion service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Infusion found', data: infusion });
});

/**
 * @description Controller for "update Infusion" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateInfusion = catchControllerError('UpdateInfusion', async (req, res) => {
  const requestData = validate(schemas.updateInfusion, { ...req.body, ...req.params });
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { user, userType, log } = res.locals;
  const infusion = await infusionService.updateInfusion({
    user, userType, ...requestData,
  }, log);
  if (!infusion) {
    return res.status(404).json({ success: false, message: 'Infusion not found' });
  }
  log.debug('updateInfusion service executed without error, sending back a success response.');
  return res.status(200).json({ success: true, message: 'Infusion updated', data: infusion });
});

/**
 * @description Controller to delete infusion
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const deleteInfusion = catchControllerError('DeleteInfusion', async (req, res) => {
  const requestData = validate(schemas.deleteInfusion, req.params);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { user, userType, log } = res.locals;
  await infusionService.deleteInfusion({ ...requestData, user, userType }, log);
  log.debug('deleteInfusion service executed without error, sending back a success response');
  return res.status(204).json({});
});

export default {
  createInfusion,
  getSingleInfusion,
  getAllInfusion,
  updateInfusion,
  deleteInfusion,
};
