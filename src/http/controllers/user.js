import userService from '../../services/user';
import userValidation from '../validations/user';
import config from '../config';

/**
 * @description Controller for create admin user API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createAdminUser = async (req, res) => {
  const { log } = res.locals;
  log.debug('Executing the createAdminUser controller');
  const {
    name, email, password, location,
  } = req.body;
  try {
    const user = await userService.createAdminUser({
      name, email, password, location,
    }, log);
    log.debug('CreateAdminUser service executed without error, sending back a success response');
    return res.status(201).json({ success: true, message: 'Admin user created successfully', data: user });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('CreateAdminUser service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'CreateAdminUser service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error creating admin user' });
  }
};

/**
 * @description Controller for confirm user account API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const confirmUserAccount = async (req, res) => {
  const { log } = res.locals;
  log.debug('Executing confirmUserAccount controller');
  const { regToken } = req.query;
  try {
    await userService.confirmUserAccount(regToken, log);
    log.debug('ConfirmUserAccount service executed without error, sending back a success response');
    return res.status(302).redirect(`${config.clientAppUrl}/login`);
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('ConfirmUserAccount service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'ConfirmUserAccount service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error confirming user account' });
  }
};

/**
 * @description User login controller
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const login = async (req, res) => {
  const { log } = res.locals;
  log.debug('Executing the login controller');
  const { email, password, userType } = req.body;
  try {
    const { token, user } = await userService.login({ email, password, userType }, log);
    log.debug('Login service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Login successfully', data: { token, user } });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('Login service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'Login service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error logging user in' });
  }
};

export default {
  createAdminUser: [userValidation.createAdminUser, createAdminUser],
  confirmUserAccount: [userValidation.validateRegToken, confirmUserAccount],
  login: [userValidation.login, login],
};
