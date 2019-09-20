import userService from '../../services/user';
import userValidation from '../validations/user';

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

export default {
  createAdminUser: [userValidation.createAdminUser, createAdminUser],
};
