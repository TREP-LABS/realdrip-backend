import passwordGenerator from 'generate-password';
import bcrypt from 'bcrypt';
import config from '../config';
import db from '../../db';
import emailService from '../email';

/**
 * @description Format the user data to be returned to the client
 * @param {object} user The raw user data gotten from the database
 * @returns {object} The formatted user data
 */
const formatUserData = user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phoneNo: user.phoneNo,
  defaultPass: user.defaultPass,
  hospitalId: user.hospitalId,
  wardId: user.wardId,
});

/**
 * @description The service function that creates a nurse user
 * @param {object} data The nurse user data
 * @param {function} log Logger utility for logging messages
 * @returns {object} The new user
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const createNurseUser = async (data, log) => {
  log.debug('Executing createNurseUser service');
  const {
    name, email, phoneNo, hospitalId, wardId,
  } = data;
  const lowerCaseEmail = email.toLowerCase();
  const { NURSE_USER } = db.users.userTypes;

  log.debug('Checking if a nurse user with the given email already exist');
  const alreadyExistingUser = await db.users.getUser(
    { email: lowerCaseEmail, wardId, hospitalId }, NURSE_USER,
  );
  if (alreadyExistingUser) {
    log.debug('Nurse user with the given email already exist, throwing error');
    const error = new Error('Nurse user with this email already exist');
    error.httpStatusCode = 409;
    throw error;
  }
  log.debug('Creating a default password for this user');
  const defaultPassword = passwordGenerator.generate({ length: 10, numbers: true });
  log.debug('Hashing user password');
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
  log.debug('Saving user data in database');
  const nurseUser = await db.users.createUser({
    name,
    phoneNo,
    hospitalId,
    wardId,
    email: lowerCaseEmail,
    password: hashedPassword,
    defaultPass: true,
  }, NURSE_USER);

  const loginUrl = `${config.clientAppUrl}/login`;
  log.debug('Sending email notification containing nurse login creds');

  emailService.sendNewNurseUserNotification({ name, email, password: defaultPassword }, loginUrl)
    .catch(err => log.error(err, `Error sending email to  ${email}`));
  return formatUserData(nurseUser);
};

/**
 * @description The service function that gets a single nurse user
 * @param {object} data The data required for this service to execute
 * @param {function} log Logger utility for logging messages
 * @returns {object} The nurse user
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getSingleNurseUser = async (data, log) => {
  log.debug('Executing getSingleNurseUser service');
  const { nurseId } = data;
  const { NURSE_USER } = db.users.userTypes;
  log.debug('Querying DB for a single nurse');
  const nurseUser = await db.users.getUser({ _id: nurseId }, NURSE_USER);
  return formatUserData(nurseUser);
};

/**
 * @description The service function that gets all nurse users
 * @param {object} data The nurse user data
 * @param {function} log Logger utility for logging messages
 * @returns {object} all nurses
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getAllNurseUser = async (data, log) => {
  log.debug('Executing getAllNurseUser service');
  const { hospitalId, wardId } = data;
  const userMatch = JSON.parse(JSON.stringify({ hospitalId, wardId }));
  const { NURSE_USER } = db.users.userTypes;
  const userFields = [
    '_id', 'name', 'phoneNo', 'email', 'hospitalId', 'wardId',
  ];
  log.debug('Querying db for all nurses that matches the given hospitalId and wardId');
  let nurses = await db.users.getAllUsers(userMatch, NURSE_USER, userFields);
  nurses = nurses.map(user => formatUserData(user));
  return nurses;
};

  /**
 * @description The service function that updates a nurse user data
 * @param {object} data The editable user data and nurseId
 * @param {function} log Logger utility for logging messages
 * @returns {object} The updated user data
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const updateNurseUser = async (data, log) => {
  log.debug('Executing updateNurseUser service');
  const { name, phoneNo, nurseId } = data;
  const { NURSE_USER } = db.users.userTypes;
  const user = await db.users.getUser({ _id: nurseId }, NURSE_USER);
  if (!user) {
    log.debug('The nurse user does not exist');
    const error = new Error('User does not exist');
    error.httpStatusCode = 404;
    throw error;
  }
  const fieldsToUpdate = JSON.parse(JSON.stringify({ name, phoneNo }));
  const { _doc: updatedUser } = await db.users.updateUser(
    { _id: nurseId }, fieldsToUpdate, NURSE_USER,
  );
  return formatUserData(updatedUser);
};

export default {
  createNurseUser,
  getSingleNurseUser,
  getAllNurseUser,
  updateNurseUser,
};
