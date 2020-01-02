import nurseUserService from '../../../services/user/nurseUser';
import db from '../../../db';
import catchControllerError from '../helpers/catchControllerError';
import validate from '../../validations/validate';
import * as schemas from '../../validations/schemas/user';
import invalidReqeust from '../helpers/invalidRequest';

/**
 * @description Controller for "create nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createNurseUser = catchControllerError('CreateNurseUser', async (req, res) => {
  const { log, user: { _id: wardId, hospitalId } } = res.locals;
  const requestData = validate(schemas.createNurseUser, req.body, res);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const user = await nurseUserService.createNurseUser({
    ...requestData, hospitalId, wardId,
  }, log);
  log.debug('CreateNurseUser service executed without error, sending back a success response');
  return res.status(201).json({ success: true, message: 'Nurse user created successfully', data: user });
});

/**
 * @description Controller for "get single Nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleNurseUser = catchControllerError('GetSingleNurseUser', async (req, res) => {
  const requestData = validate(schemas.getSingleNurseUser, req.params);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { log } = res.locals;
  const nurseUser = await nurseUserService.getSingleNurseUser(requestData, log);
  if (!nurseUser) {
    log.debug('getSingleNurseUser service did not return a user, sending back a 404 response');
    return res.status(404).json({ success: true, message: 'Nurse not found' });
  }
  log.debug('getSingleNurseUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Operation successful', data: nurseUser });
});

/**
 * @description Controller for "get all nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllNurseUser = catchControllerError('GetAllNurseUser', async (req, res) => {
  const { log, user, userType } = res.locals;
  const hospitalId = userType === db.users.userTypes.HOSPITAL_ADMIN_USER
    ? user._id : user.hospitalId;
  const wardId = userType === db.users.userTypes.WARD_USER ? user._id : user.wardId;

  const nurses = await nurseUserService.getAllNurseUser({ hospitalId, wardId }, log);
  log.debug('getAllNurseUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Nurse users fetched successfully', data: nurses });
});

/**
 * @description Controller for "update nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateNurseUser = catchControllerError('UpdateNurseUser', async (req, res) => {
  const { log } = res.locals;
  const requestData = validate(schemas.updateNurseUser, { ...req.body, ...req.params });
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const user = await nurseUserService.updateNurseUser(requestData, log);
  log.debug('UpdateNurseUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Nurse user updated successfully', data: user });
});

export default {
  createNurseUser,
  getSingleNurseUser,
  getAllNurseUser,
  updateNurseUser,
};
