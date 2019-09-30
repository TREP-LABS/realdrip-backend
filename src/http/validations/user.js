import validator from 'validator';
import db from '../../db';
import FieldErrors from './fieldErrors';

/**
 * @description Validates the request data to create an admin user.
 * If the request data is valid, the request is sent to the next middleware otherwise,
 * a faliure response is sent to the user.
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express helper function to pass request to the next middleware
 */
const createAdminUser = (req, res, next) => {
  const {
    name, email, password, confirmPassword,
    location: { country, state, address },
  } = req.body;

  const fieldErrors = new FieldErrors();

  // Validating name field
  if (!name || typeof (name) !== 'string') fieldErrors.addError('name', 'Medical center name is a required string');
  else if (name.trim().length < 3) fieldErrors.addError('name', 'Medical center name must be at least 3 characters');

  // Validating email field
  if (!email || typeof (email) !== 'string') fieldErrors.addError('email', 'Medical center email is a required string');
  else if (!validator.isEmail(email)) fieldErrors.addError('email', 'Medical center email format is a not valid');

  // Validating password field
  if (!password || typeof (password) !== 'string') fieldErrors.addError('password', 'Password field is a required string');
  else if (!(/\d/.test(password) && /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length > 7)) {
    fieldErrors.addError('password', 'Password must be at least 7 character mix of capital, small letters with numbers');
  } else if (!confirmPassword || typeof (confirmPassword) !== 'string') {
    fieldErrors.addError('confirmPassword', 'Confirm password field is a required string');
  } else if (password !== confirmPassword) {
    fieldErrors.addError('confirmPassword', 'Confirm password field must match the password field');
  }

  // Validating location fields
  if (!country || typeof (country) !== 'string') fieldErrors.addError('location.country', 'Country field is a required string');
  if (!state || typeof (state) !== 'string') fieldErrors.addError('location.state', 'State field is a required string');
  if (!address || typeof (address) !== 'string') fieldErrors.addError('location.address', 'Address field is a required string');

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request body', errors: fieldErrors.errors });
  }
  return next();
};

/**
 * @description Validates a user registeration token. If the token is valid,
 * the request is sent to the next middleware otherwise, a faliure response is sent to the user.
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express helper function to pass request to the next middleware
 */
const validateRegToken = (req, res, next) => {
  const { regToken } = req.query;
  const fieldErrors = new FieldErrors();
  if (!regToken || typeof (regToken) !== 'string') {
    fieldErrors.addError('regToken', 'regToken is a required query parameter');
  }
  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request', errors: fieldErrors.errors });
  }
  return next();
};

/**
 * @description Validate user login request data.
 * If the request data is valid, the request is sent to the next middleware otherwise,
 * a faliure response is sent to the user.
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} Express helper function to pass request to the next middleware
 */
const login = (req, res, next) => {
  const { email, password, userType } = req.body;
  const fieldErrors = new FieldErrors();

  // Validating email field
  if (!email || typeof (email) !== 'string') fieldErrors.addError('email', 'Medical center email is a required string');
  else if (!validator.isEmail(email)) fieldErrors.addError('email', 'Medical center email format is a not valid');

  // Validating password field
  if (!password || typeof (password) !== 'string') fieldErrors.addError('password', 'Password field is a required string');

  // Validating user type field
  const userTypes = Object.values(db.users.userTypes);
  if (!userType || !userTypes.includes(userType)) {
    fieldErrors.addError('userType', `userType field must be one of the following: ${userTypes.join(' ')}`);
  }

  if (fieldErrors.count > 0) {
    return res.status(400).json({ success: false, message: 'Invalid request body', errors: fieldErrors.errors });
  }
  return next();
};


export default {
  createAdminUser,
  validateRegToken,
  login,
};
