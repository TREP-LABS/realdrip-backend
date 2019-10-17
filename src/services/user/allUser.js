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
  const userId = user._id;
  log.debug('Create an auth token for this user');
  const token = jwt.sign({ type: userType, id: userId }, config.jwtSecrete, { expiresIn: '3d' });
  return { user: formatUserData(user), token };
};


export default {
  login,
};
