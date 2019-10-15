import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import emailService from './email';
import config from './config';

const createAdminUser = async (data, log) => {
  log.debug('Executing createAdminUser service');
  const {
    name, email, location, password,
  } = data;
  const lowerCaseEmail = email.toLowerCase();
  const { HOSPITAL_ADMIN_USER } = db.users.userTypes;
  log.debug('Checking if a user with the given email already exist');
  const alreadyExistingUser = await db.users.getUser({ email: lowerCaseEmail },
    HOSPITAL_ADMIN_USER);
  if (alreadyExistingUser) {
    log.debug('User with the given email already exist, throwing error');
    const error = new Error('User with this email already exist');
    error.httpStatusCode = 409;
    throw error;
  }
  log.debug('Hashing user password');
  const hashedPassword = await bcrypt.hash(password, 10);
  log.debug('Saving user data in database');
  const adminUser = await db.users.createUser({
    name,
    email: lowerCaseEmail,
    location,
    password: hashedPassword,
    confirmedEmail: false,
    verifiedPurchase: false,
  }, HOSPITAL_ADMIN_USER);
  log.debug('Create a registeration token');
  const regToken = jwt.sign({ email, userType: HOSPITAL_ADMIN_USER }, config.jwtSecrete);
  const confirmationUrl = `${config.appUrl}/api/users/confirm?regToken=${regToken}`;
  // NOTE: The actions below is asynchronous, however, I don't need to wait for it to complete
  // before sending response to the user.
  log.debug('Sending email address validation mail notification');
  emailService.sendEmailAddresValidation({ name, email }, confirmationUrl)
    .catch(err => log.error(err, `Error sending email to  ${email}`));
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: adminUser._id,
    name: adminUser.name,
    email: adminUser.email,
    location: adminUser.location,
    confirmedEmail: adminUser.confirmedEmail,
    verifiedPurchase: adminUser.verifiedPurchase,
  };
};

/**
 * @description The service function that confirms a user account
 * @param {string} regToken The user registeration token
 * @returns {Promise} A promise that resolves or reject to the db operation to update a user data.
 * @throws {Error} Any error that prevents the service to execute successfully
 */
const confirmUserAccount = async (regToken, log) => {
  log.debug('Executing confirmUserAccount service');
  try {
    log.debug('Verify the registeration token');
    const decoded = jwt.verify(regToken, config.jwtSecrete);
    const { email, userType } = decoded;
    log.debug('Registeration token is valid, update user information in the DB');
    return db.users.updateUser(email, { confirmed: true }, userType);
  } catch (err) {
    log.debug('Unable to verify the registeration token, throwing error');
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
const login = async (data, log) => {
  log.debug('Executing login service');
  const { email, password, userType } = data;
  log.debug('Check if a user with the given email exist');
  const user = await db.users.getUser({ email: email.toLowerCase() }, userType);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    log.debug('The given email or password is not correct, throwing error');
    const error = new Error('Email or password incorrect');
    error.httpStatusCode = 400;
    throw error;
  }
  // eslint-disable-next-line no-underscore-dangle
  const userId = user._id;
  log.debug('Create an auth token for this user');
  const token = jwt.sign({ type: userType, id: userId }, config.jwtSecrete, { expiresIn: '3d' });
  return {
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      confirmedEmail: user.confirmedEmail,
      verifiedPurchase: user.verifiedPurchase,
      defaultPass: user.defaultPass,
      wardId: user.wardId,
      hospitalId: user.hospitalId,
    },
    token,
  };
};


export default {
  createAdminUser,
  confirmUserAccount,
  login,
};
