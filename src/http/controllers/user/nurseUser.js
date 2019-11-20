import nurseUserService from '../../../services/user/nurseUser';
import userValidation from '../../validations/user';
import db from '../../../db';
import catchControllerError from '../catchControllerError';

/**
 * @description Controller for "create nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createNurseUser = catchControllerError('CreateNurseUser', async (req, res) => {
  const { log, user: { _id: wardId, hospitalId } } = res.locals;
  const { name, email, phoneNo } = req.body;
  const user = await nurseUserService.createNurseUser({
    name, email, phoneNo, hospitalId, wardId,
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
  const { log } = res.locals;
  const { nurseId } = req.params;
  const nurseUser = await nurseUserService.getSingleNurseUser({ nurseId }, log);
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
  const { name, phoneNo } = req.body;
  const { nurseId } = req.params;
  const user = await nurseUserService.updateNurseUser({ name, phoneNo, nurseId }, log);
  log.debug('UpdateNurseUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Nurse user updated successfully', data: user });
});

export default {
  createNurseUser: [userValidation.createNurseUser, createNurseUser],
  getSingleNurseUser: [userValidation.validateNurseId, getSingleNurseUser],
  getAllNurseUser,
  updateNurseUser: [
    userValidation.validateNurseId,
    userValidation.updateNurseUser,
    updateNurseUser],
};
