import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../db';
import emailService from '../email';
import config from '../config';

/**
 * @description Format the user data to be returned to the client
 * @param {object} user The raw user data gotten from the database
 * @returns {object} The formatted user data
 */
const formatUserData = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  location: user.location,
  confirmedEmail: user.confirmedEmail,
  verifiedPurchase: user.verifiedPurchase,
});

/**
 * @description The service function that creates an hospital user
 * @param {object} data The hospital user data
 * @param {function} log Logger utility for logging messages
 * @returns {object} The new user
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const createAdminUser = async (data, log) => {
  log.debug('Executing createAdminUser service');
  const {
    name, email, location, password,
  } = data;
  const lowerCaseEmail = email.toLowerCase();
  const { HOSPITAL_ADMIN_USER } = db.users.userTypes;
  log.debug('Checking if a user with the given email already exist');
  const alreadyExistingUser = await db.users.getUser(
    { email: lowerCaseEmail }, HOSPITAL_ADMIN_USER,
  );
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
  const confirmationUrl = `${config.serverAppUrl}/api/hospital/confirmEmail?regToken=${regToken}`;
  // NOTE: The actions below is asynchronous, however, I don't need to wait for it to complete
  // before sending response to the user.
  log.debug('Sending email address validation mail notification');
  emailService.sendEmailAddresValidation({ name, email }, confirmationUrl)
    .catch(err => log.error(err, `Error sending email to  ${email}`));
  return formatUserData(adminUser);
};

/**
 * @description The service function that updates an admin user account details
 * @param {object} data The editable user data and the userId
 * @param {function} log Logger utility for logging messages
 * @returns {object} The updated user data
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const updateAdminUser = async (data, log) => {
  log.debug('Executing updateAdminUser service');
  const { name, location, userId } = data;
  const { HOSPITAL_ADMIN_USER } = db.users.userTypes;
  const fieldsToUpdate = JSON.parse(JSON.stringify({ name, location }));
  const { _doc: updatedUser } = await db.users.updateUser(
    { _id: userId }, fieldsToUpdate, HOSPITAL_ADMIN_USER,
  );
  return formatUserData(updatedUser);
};

/**
 * @description The service function that confirms a user account
 * @param {string} regToken The user registeration token
 * @param {function} log Logger utility for logging messages
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
    return db.users.updateUser({ email }, { confirmedEmail: true }, userType);
  } catch (err) {
    log.debug('Unable to verify the registeration token, throwing error');
    const error = new Error('Registeration token not valid');
    error.httpStatusCode = 400;
    throw error;
  }
};

export default {
  createAdminUser,
  updateAdminUser,
  confirmUserAccount,
};
