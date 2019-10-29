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

export default {
  createNurseUser,
};