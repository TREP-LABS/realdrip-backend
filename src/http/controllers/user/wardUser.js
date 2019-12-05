import wardUserService from '../../../services/user/wardUser';
import userValidation from '../../validations/user';
import catchControllerError from '../catchControllerError';

/**
 * @description Controller for "create ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createWardUser = catchControllerError('CreateWardUser', async (req, res) => {
  const { log, user: { _id: hospitalId } } = res.locals;
  const { name, email, label } = req.body;
  const user = await wardUserService.createWardUser({
    name, email, label, hospitalId,
  }, log);
  log.debug('CreateWardUser service executed without error, sending back a success response');
  return res.status(201).json({ success: true, message: 'Ward user created successfully', data: user });
});

/**
 * @description Controller for "update ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const updateWardUser = catchControllerError('UpdateWardUser', async (req, res) => {
  const { log } = res.locals;
  const { name, label } = req.body;
  const { wardId } = req.params;
  const user = await wardUserService.updateWardUser({ name, label, wardId }, log);
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
  const { limit, cursor } = req.query;
  const wardUsers = await wardUserService.getAllWardUser({ hospitalId, limit, cursor }, log);
  log.debug('GetAllWardUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Operation successful', data: wardUsers });
});


/**
 * @description Controller for "get single ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleWardUser = catchControllerError('GetSingleWardUser', async (req, res) => {
  const { log } = res.locals;
  const { wardId } = req.params;
  const wardUser = await wardUserService.getSingleWardUser({ wardId }, log);
  if (!wardUser) {
    log.debug('GetSingleWardUser service did not return a user, sending back a 404 response');
    return res.status(404).json({ success: true, message: 'Ward user not found' });
  }
  log.debug('GetSingleWardUser service executed without error, sending back a success response');
  return res.status(200).json({ success: true, message: 'Operation successful', data: wardUser });
});


export default {
  createWardUser: [userValidation.createWardUser, createWardUser],
  getSingleWardUser: [userValidation.validateWardId, getSingleWardUser],
  updateWardUser: [userValidation.validateWardId, userValidation.updateWardUser, updateWardUser],
  getAllWardUser,
};
