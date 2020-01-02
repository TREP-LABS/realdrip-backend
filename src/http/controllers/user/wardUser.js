import wardUserService from '../../../services/user/wardUser';
import catchControllerError from '../helpers/catchControllerError';
import validate from '../../validations/validate';
import * as schemas from '../../validations/schemas/user';
import invalidReqeust from '../helpers/invalidRequest';

/**
 * @description Controller for "create ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createWardUser = catchControllerError('CreateWardUser', async (req, res) => {
  const { log, user: { _id: hospitalId } } = res.locals;
  const requestData = validate(schemas.createWardUser, req.body, res);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const user = await wardUserService.createWardUser({ ...requestData, hospitalId }, log);
  log.debug('CreateWardUser service executed without error, sending back a success response');
  return res.status(201).json({ success: true, message: 'Ward user created successfully', data: user });
});

/**
 * @description Controller for "update ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateWardUser = catchControllerError('UpdateWardUser', async (req, res) => {
  const requestData = validate(schemas.updateWardUser, { ...req.body, ...req.params });
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { log } = res.locals;
  const user = await wardUserService.updateWardUser(requestData, log);
  log.debug('UpdateWardUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Ward user updated successfully', data: user });
});

/**
 * @description Controller for "get all ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllWardUser = catchControllerError('GetAllWardUser', async (req, res) => {
  const { log, user: { _id: hospitalId } } = res.locals;

  const wardUsers = await wardUserService.getAllWardUser({ hospitalId }, log);
  log.debug('GetAllWardUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Operation successful', data: wardUsers });
});


/**
 * @description Controller for "get single ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleWardUser = catchControllerError('GetSingleWardUser', async (req, res) => {
  const requestData = validate(schemas.getSingleWardUser, req.params);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { log } = res.locals;
  const wardUser = await wardUserService.getSingleWardUser(requestData, log);
  if (!wardUser) {
    log.debug('GetSingleWardUser service did not return a user, sending back a 404 response');
    return res.status(404).json({ success: true, message: 'Ward user not found' });
  }
  log.debug('GetSingleWardUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Operation successful', data: wardUser });
});


export default {
  createWardUser,
  getSingleWardUser,
  updateWardUser,
  getAllWardUser,
};
