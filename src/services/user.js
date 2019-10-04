import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import emailService from './email';
import config from './config';

const createAdminUser = async (data) => {
  const {
    name, email, location, password,
  } = data;
  const lowerCaseEmail = email.toLowerCase();
  const { HOSPITAL_ADMIN_USER } = db.users.userTypes;
  const alreadyExistingUser = await db.users.getUserByEmail(lowerCaseEmail, HOSPITAL_ADMIN_USER);
  if (alreadyExistingUser) {
    const error = new Error('User with this email already exist');
    error.httpStatusCode = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const adminUser = await db.users.createUser({
    name,
    email: lowerCaseEmail,
    location,
    password: hashedPassword,
    confirmed: false,
    deviceCount: 0,
  }, HOSPITAL_ADMIN_USER);
  const regToken = jwt.sign({ email, userType: HOSPITAL_ADMIN_USER }, config.jwtSecrete);
  const confirmationUrl = `${config.appUrl}/api/users/confirm?regToken=${regToken}`;
  // NOTE: The actions below is asynchronous, however, I don't need to wait for it to complete
  // before sending response to the user.
  emailService.sendEmailAddresValidation({ name, email }, confirmationUrl)
    .catch((err) => {
      console.log('Error sending email to user with email: ', email);
      console.log(err);
    });
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: adminUser._id,
    name: adminUser.name,
    email: adminUser.email,
    location: adminUser.location,
    confirmed: adminUser.confirmed,
    deviceCount: adminUser.deviceCount,
  };
};

/**
 * @description The service function that confirms a user account
 * @param {string} regToken The user registeration token
 * @returns {Promise} A promise that resolves or reject to the db operation to update a user data.
 * @throws {Error} Any error that prevents the service to execute successfully
 */
const confirmUserAccount = async (regToken) => {
  try {
    const decoded = jwt.verify(regToken, config.jwtSecrete);
    const { email, userType } = decoded;
    return db.users.updateUser(email, { confirmed: true }, userType);
  } catch (err) {
    const error = new Error('Registeration token not valid');
    error.httpStatusCode = 400;
    throw error;
  }
};

/**
 * @description Grants authorization to a valid user
 * @param {object} data The data required to perform the login operation
 * @param {string} data.email The user email
 * @param {string} data.password The user password
 * @param {string} data.userType The user type
 * @returns {object} The user details and authorization token
 * @throws {Error} Throws an error is operations fails
 */
const login = async (data) => {
  const { email, password, userType } = data;
  const user = await db.users.getUserByEmail(email.toLowerCase(), userType);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error('Email or password incorrect');
    error.httpStatusCode = 400;
    throw error;
  }
  // eslint-disable-next-line no-underscore-dangle
  const userId = user._id;
  return {
    user: {
      id: userId,
      type: userType,
      name: user.name,
      email: user.email,
      confirmed: user.confirmed,
      defaultPass: user.defaultPass,
      hospitalId: user.hospitalId,
      deviceCount: user.deviceCount,
    },
    token: jwt.sign({ type: userType, id: userId }, config.jwtSecrete, { expiresIn: '3d' }),
  };
};


export default {
  createAdminUser,
  confirmUserAccount,
  login,
};
