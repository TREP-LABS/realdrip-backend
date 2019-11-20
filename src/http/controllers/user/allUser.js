import userService from '../../../services/user/allUser';
import userValidation from '../../validations/user';
import catchControllerError from '../catchControllerError';

/**
 * @description User login controller
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const login = catchControllerError('Login', async (req, res) => {
  const { log } = res.locals;
  const { email, password, userType } = req.body;
  const { token, user } = await userService.login({ email, password, userType }, log);
  log.debug('Login service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Login successfully', data: { token, user } });
});


/**
 * @description Update user password controller
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updatePassword = catchControllerError('UpdatePassword', async (req, res) => {
  const { log } = res.locals;
  const { formerPassword, newPassword } = req.body;
  const { userType } = res.locals;
  const { userId } = req.params;
  await userService.updatePassword({
    formerPassword, newPassword, userId, userType,
  }, log);
  log.debug('UpdatePassword service executed without error, sending back a success response');
  return res.status(204).json({});
});

export default {
  login: [userValidation.login, login],
  updatePassword: [userValidation.udpateUserPassword, updatePassword],
};
