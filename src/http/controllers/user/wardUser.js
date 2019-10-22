import wardUserService from '../../../services/user/wardUser';
import userValidation from '../../validations/user';

/**
 * @description Controller for "create ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createWardUser = async (req, res) => {
  const { log, user: { _id: hospitalId } } = res.locals;
  log.debug('Executing the createWardUser controller');
  const { name, email, label } = req.body;
  try {
    const user = await wardUserService.createWardUser({
      name, email, label, hospitalId,
    }, log);
    log.debug('CreateWardUser service executed without error, sending back a success response');
    return res.status(201).json({ success: true, message: 'Ward user created successfully', data: user });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('CreateWardUser service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'CreateWardUser service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error creating admin user' });
  }
};


/**
 * @description Controller for "get single ward user" API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const getSingleWardUser = async (req, res) => {
  const { log } = res.locals;
  log.debug('Executing the getSingleWardUser controller');
  const { wardId } = req.params;
  try {
    const wardUser = await wardUserService.getSingleWardUser({ wardId }, log);
    if (!wardUser) {
      log.debug('GetSingleWardUser service did not return a user, sending back a 404 response');
      return res.status(404).json({ success: true, message: 'Ward user not found' });
    }
    log.debug('GetSingleWardUser service executed without error, sending back a success response');
    return res.status(200).json({ success: true, message: 'Operation successful', data: wardUser });
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug('GetSingleWardUser service failed with an http status code, sending back a failure response');
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, 'GetSingleWardUser service failed without an http status code');
    return res.status(500).json({ success: false, message: 'Error getting a single ward user' });
  }
};


export default {
  createWardUser: [userValidation.createWardUser, createWardUser],
  getSingleWardUser: [userValidation.validateWardId, getSingleWardUser],
};
