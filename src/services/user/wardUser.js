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
  label: user.label,
  defaultPass: user.defaultPass,
  hospitalId: user.hospitalId,
});

/**
 * @description The service function that creates a ward user
 * @param {object} data The ward user data
 * @param {function} log Logger utility for logging messages
 * @returns {object} The new user
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const createWardUser = async (data, log) => {
  log.debug('Executing createWardUser service');
  const {
    name, email, label, hospitalId,
  } = data;
  const lowerCaseEmail = email.toLowerCase();
  const { WARD_USER } = db.users.userTypes;
  log.debug('Checking if a ward user with the given email already exist');
  const alreadyExistingUser = await db.users.getUser(
    { email: lowerCaseEmail }, WARD_USER,
  );
  if (alreadyExistingUser) {
    log.debug('Ward user with the given email already exist, throwing error');
    const error = new Error('Ward user with this email already exist');
    error.httpStatusCode = 409;
    throw error;
  }
  log.debug('Creating a default password for this user');
  const defaultPassword = passwordGenerator.generate({ length: 10, numbers: true });
  log.debug('Hashing user password');
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
  log.debug('Saving user data in database');
  const wardUser = await db.users.createUser({
    hospitalId,
    name,
    label,
    email: lowerCaseEmail,
    password: hashedPassword,
    defaultPass: true,
  }, WARD_USER);

  const loginUrl = `${config.clientAppUrl}/login`;
  log.debug('Sending email notification containing ward login creds');
  emailService.sendNewWardUserNotification({ name, email, password: defaultPassword }, loginUrl)
    .catch(err => log.error(err, `Error sending email to  ${email}`));

  return formatUserData(wardUser);
};

export default {
  createWardUser,
};
