import userService from '../../../services/user/allUser';
import userValidation from '../../validations/user';

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
  login: [userValidation.login, login],
};
