import hospitalUserService from '../../../services/user/hospitalUser';
import userValidation from '../../validations/user';
import config from '../../config';
import catchControllerError from '../catchControllerError';

/**
 * @description Controller for create admin user API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createAdminUser = catchControllerError('CreateHospitalUser', async (req, res) => {
  const { log } = res.locals;
  const {
    name, email, password, location,
  } = req.body;
  const user = await hospitalUserService.createAdminUser({
    name, email, password, location,
  }, log);
  log.debug('CreateAdminUser service executed without error, sending back a success response');
  return res.status(201).json({ success: true, message: 'Admin user created successfully', data: user });
});

/**
 * @description Controller for "update admin user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateAdminUser = catchControllerError('UpdateHospitalUser', async (req, res) => {
  const { log } = res.locals;
  const { name, location } = req.body;
  const { userId } = req.params;
  const user = await hospitalUserService.updateAdminUser({ name, location, userId }, log);
  log.debug('UpdateAdminUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
});

/**
 * @description Controller for confirm user account API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const confirmUserAccount = catchControllerError('ConfirmUserAccount', async (req, res) => {
  const { log } = res.locals;
  const { regToken } = req.query;
  await hospitalUserService.confirmUserAccount(regToken, log);
  log.debug('ConfirmUserAccount service executed without error, sending back a success response');
  return res.status(302).redirect(`${config.clientAppUrl}/login`);
});

/**
 * @description Controller for sendEmailValidationMail mail API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const sendEmailValidationMail = catchControllerError('sendEmailValidationMail', async (req, res) => {
  const { log, user: { name, email } } = res.locals;
  await hospitalUserService.sendEmailValidationMail({ name, email }, log);
  log.debug('sendEmailValidationMail service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Email address validation mail sent' });
});

export default {
  createAdminUser: [userValidation.createAdminUser, createAdminUser],
  confirmUserAccount: [userValidation.validateRegToken, confirmUserAccount],
  updateAdminUser: [userValidation.updateHospitalUser, updateAdminUser],
  sendEmailValidationMail,
};
