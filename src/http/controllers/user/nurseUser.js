import nurseUserService from '../../../services/user/nurseUser';
import userValidation from '../../validations/user';
import db from '../../../db';


/**
 * @description Controller for "create nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createNurseUser = async (req, res) => {
  const { log, user: { _id: wardId, hospitalId } } = res.locals;
  log.debug('Executing the createNurseUser controller');
  const { name, email, phoneNo } = req.body;
  try {
    const user = await nurseUserService.createNurseUser({
      name, email, phoneNo, hospitalId, wardId,
    }, log);
    log.debug('CreateNurseUser service executed without error, sending back a success response');
    return res.status(201).json({ success: true, message: 'Nurse user created successfully', data: user });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('CreateNurseUser service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'CreateNurseUser service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error creating nurse user' });
  }
};

/**
 * @description Controller for "get single Nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleNurseUser = async (req, res) => {
  const { log } = res.locals;
  log.debug('Executing the getSingleNurseUser controller');
  const { nurseId } = req.params;
  try {
    const nurseUser = await nurseUserService.getSingleNurseUser({ nurseId }, log);
    if (!nurseUser) {
      log.debug('getSingleNurseUser service did not return a user, sending back a 404 response');
      return res.status(404).json({ success: true, message: 'Nurse not found' });
    }
    log.debug('getSingleNurseUser service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Operation successful', data: nurseUser });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('getSingleNurseUser service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'getSingleNurseUser service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error getting nurse' });
  }
};

/**
 * @description Controller for "get all nurse user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getAllNurseUser = async (req, res) => {
  const { log, user, userType } = res.locals;
  const hospitalId = userType === db.users.userTypes.HOSPITAL_ADMIN_USER
    ? user._id : user.hospitalId;
  const wardId = userType === db.users.userTypes.WARD_USER ? user._id : user.wardId;

  log.debug('Executing getAllNurseUser controller');
  try {
    const nurses = await nurseUserService.getAllNurseUser({ hospitalId, wardId }, log);
    log.debug('getAllNurseUser service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Nurse users fetched successfully', data: nurses });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('getAllNurseUser service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'getAllNurseUser service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error fetching all nurses' });
  }
};

export default {
  createNurseUser: [createNurseUser],
  getSingleNurseUser: [userValidation.validateNurseId, getSingleNurseUser],
  getAllNurseUser,
};
