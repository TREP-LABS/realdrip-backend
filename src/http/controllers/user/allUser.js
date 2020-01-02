import userService from '../../../services/user/allUser';
import catchControllerError from '../helpers/catchControllerError';
import invalidReqeust from '../helpers/invalidRequest';
import validate from '../../validations/validate';
import * as schemas from '../../validations/schemas/user';

/**
 * @description User login controller
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const login = catchControllerError('Login', async (req, res) => {
  const { log } = res.locals;
  const requestData = validate(schemas.login, req.body);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { token, user } = await userService.login(requestData, log);
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
  const requestData = validate(schemas.updatePassword, { ...req.body, ...req.params }, res);
  if (requestData.error) return invalidReqeust(res, { errors: requestData.error });

  const { userType } = res.locals;
  await userService.updatePassword({ ...requestData, userType }, log);
  log.debug('UpdatePassword service executed without error, sending back a success response');
  return res.status(204).json({});
});

export default {
  login,
  updatePassword,
};
