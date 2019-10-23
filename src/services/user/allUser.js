import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../db';
import config from '../config';

/**
 * @description Format the user data to be returned to the client
 * @param {object} user The raw user data gotten from the database
 * @returns {object} The formatted user data
 */
const formatUserData = user => JSON.parse(JSON.stringify({
  id: user._id,
  name: user.name,
  email: user.email,
  phoneNo: user.phoneNo,
  location: user.location,
  confirmedEmail: user.confirmedEmail,
  verifiedPurchase: user.verifiedPurchase,
  defaultPass: user.defaultPass,
  hospitalId: user.hospitalId,
  deviceCount: user.deviceCount,
}));

/**
 * @description Grants authorization to a valid user.
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
  const userId = user._id;
  log.debug('Create an auth token for this user');
  const token = jwt.sign({ type: userType, id: userId }, config.jwtSecrete, { expiresIn: '3d' });
  return { user: formatUserData(user), token };
};

/**
 * @description Updates a user password in the database
 * @param {object} data The data required to execute this service
 * @param {string} data.formerPassword The user former password
 * @param {string} data.formerHashedPassword The user former hashed password
 * @param {string} data.newPassword The new password to set for the user
 * @param {string} data.userId The user id
 * @param {string} data.userType The user type
 * @throws {Error} Throws an error is operations fails
 */
const updatePassword = async (data, log) => {
  log.debug('Executing updatePassword service');
  const {
    formerPassword, newPassword, userType, userId,
  } = data;
  const user = await db.users.getUser({ _id: userId }, userType);
  if (!user) {
    log.debug('The user to update does not exist');
    const error = new Error('User does not exist');
    error.httpStatusCode = 404;
    throw error;
  }
  if (!bcrypt.compareSync(formerPassword, user.password)) {
    log.debug('The formerPassword is not correct, throwing error');
    const error = new Error('Former password is not correct');
    error.httpStatusCode = 400;
    throw error;
  }
  log.debug('Hashing new user password');
  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  log.debug('Updating user password in db');
  await db.users.updateUser({ _id: userId }, { password: newHashedPassword }, userType);
};

export default {
  login,
  updatePassword,
};
