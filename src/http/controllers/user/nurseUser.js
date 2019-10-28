import nurseUserService from '../../../services/user/nurseUser';

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

export default {
  createNurseUser: [createNurseUser],
};
