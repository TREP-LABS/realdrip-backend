import passwordGenerator from 'generate-password';
import bcrypt from 'bcrypt';
import config from '../config';
import db from '../../db';
import emailService from '../email';
import ServiceError from '../serviceError';

/**
 * @description Format the user data to be returned to the client
 * @param {object} user The raw user data gotten from the database
 * @returns {object} The formatted user data
 */
const formatUserData = user => ({
  _id: user._id,
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
    throw new ServiceError('Ward user with this email already exist', 409);
  }
  log.debug('Creating a default password for this user');
  const defaultPassword = passwordGenerator.generate({ length: 10, numbers: true });
  log.debug('Hashing user password');
  const hashedPassword = bcrypt.hashSync(defaultPassword, config.bcryptHashSaltRounds);
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

/**
 * @description The service function that gets a single ward user
 * @param {object} data The data required for this service to execute
 * @param {function} log Logger utility for logging messages
 * @returns {object} The new user
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getSingleWardUser = async (data, log) => {
  log.debug('Executing getSingleWardUser service');
  const { wardId } = data;
  const { WARD_USER } = db.users.userTypes;
  log.debug('Querying DB for a single ward');
  const wardUser = await db.users.getUser({ _id: wardId }, WARD_USER);
  return formatUserData(wardUser);
};

/**
 * @description The service function that updates a ward user data
 * @param {object} data The editable user data and wardId
 * @param {function} log Logger utility for logging messages
 * @returns {object} The updated user data
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const updateWardUser = async (data, log) => {
  log.debug('Executing updateWardUser service');
  const { name, label, wardId } = data;
  const { WARD_USER } = db.users.userTypes;
  log.debug('Attempting to update ward user details');
  const fieldsToUpdate = JSON.parse(JSON.stringify({ name, label }));
  const { _doc: updatedUser } = await db.users.updateUser(
    { _id: wardId }, fieldsToUpdate, WARD_USER,
  );
  return formatUserData(updatedUser);
};

/**
 * @description The service function that gets all ward users
 * @param {object} data The data required to execute this service
 * @param {function} log Logger utility for logging messages
 * @returns {object} The ward users
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getAllWardUser = async (data, log) => {
  log.debug('Executing getAllWardUser service');
  const { hospitalId, limit, cursor } = data;
  const { WARD_USER } = db.users.userTypes;
  const userFields = [
    '_id', 'name', 'email', 'label', 'defaultPass', 'hospitalId',
  ];
  log.debug('Querying db for all ward users that matches the given hospitalId');
  const users = await db.users.getAllUsers({ hospitalId, limit, cursor }, WARD_USER, userFields);
  const wards = users.items.map(user => formatUserData(user));
  return {
    items: wards,
    pagination: users.pagination,
  };
};

export default {
  createWardUser,
  getSingleWardUser,
  updateWardUser,
  getAllWardUser,
};
