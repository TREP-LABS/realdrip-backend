import hospitalUserService from '../../../services/user/hospitalUser';
import config from '../../config';
import catchControllerError from '../helpers/catchControllerError';
import invalidReqeust from '../helpers/invalidRequest';
import validate from '../../validations/validate';
import * as schemas from '../../validations/schemas/user';

/**
 * @description Controller for create admin user API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createAdminUser = catchControllerError('CreateHospitalUser', async (req, res) => {
  const requestData = validate(schemas.createHospitalUser, req.body);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { log } = res.locals;
  const user = await hospitalUserService.createAdminUser(requestData, log);
  log.debug('CreateAdminUser service executed without error, sending back a success response');
  return res.status(201).json({ success: true, message: 'Admin user created successfully', data: user });
});

/**
 * @description Controller for "update admin user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateAdminUser = catchControllerError('UpdateHospitalUser', async (req, res) => {
  const requestData = validate(schemas.updateHospitalUser, { ...req.body, ...req.params });
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { log } = res.locals;
  const user = await hospitalUserService.updateAdminUser(requestData, log);
  log.debug('UpdateAdminUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
});

/**
 * @description Controller for confirm user account API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const confirmUserAccount = catchControllerError('ConfirmUserAccount', async (req, res) => {
  const requestData = validate(schemas.regToken, req.query.regToken);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { log } = res.locals;
  await hospitalUserService.confirmUserAccount(requestData, log);
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
  createAdminUser,
  confirmUserAccount,
  updateAdminUser,
  sendEmailValidationMail,
};
