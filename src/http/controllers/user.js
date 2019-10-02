import userService from '../../services/user';
import userValidation from '../validations/user';
import config from '../config';

/**
 * @description Controller for create admin user API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const createAdminUser = async (req, res) => {
  const {
    name, email, password, location,
  } = req.body;
  try {
    const user = await userService.createAdminUser({
      name, email, password, location,
    });
    return res.status(201).json({ success: true, message: 'Admin user created successfully', data: user });
  } catch (err) {
    if (err.httpStatusCode) {
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Error creating admin user' });
  }
};

/**
 * @description Controller for confirm user account API operation
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
const confirmUserAccount = async (req, res) => {
  const { regToken } = req.query;
  try {
    await userService.confirmUserAccount(regToken);
    return res.status(302).redirect(`${config.clientAppUrl}/login`);
  } catch (err) {
    if (err.httpStatusCode) {
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Error confirming user account' });
  }
};

export default {
  createAdminUser: [userValidation.createAdminUser, createAdminUser],
  confirmUserAccount: [userValidation.validateRegToken, confirmUserAccount],
};
