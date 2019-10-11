import userModels from './models';
import * as userTypes from './userTypes';

const createUser = async (userData, userType) => {
  const Model = userModels[userType];
  return new Model(userData).save();
};

/**
 * @description Get a single user from the database
 * @param {object} userMatch An object describing how to select the user to be fetched
 * @param {string} [userMatch._id] The unique id of the user
 * @param {string} [userMatch.email] The email of the user
 * @param {string} userType The type of user. One of hospital_admin, ward_user or nurse_user.
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getUser = async (userMatch, userType) => {
  const Model = userModels[userType];
  return Model.findOne(userMatch);
};

/**
 * @description gets user based on details supplied
 * @param {object} userDetails The user details is an object that contains user params
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */

const getUser = async (userDetails, userType) => {
  const Model = userModels[userType];
  return Model.findOne(userDetails);
};

/**
 * @description Updates user data in the database
 * @param {object} userMatch An object describing how to select the user to be udpated
 * @param {string} [userMatch._id] The unique id of the user
 * @param {string} [userMatch.email] The email of the user
 * @param {object} update The data to patch with the existing user data
 * @param {string} userType The type of user. One of hospital_admin, ward_user or nurse_user.
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const updateUser = async (userMatch, update, userType) => {
  const Model = userModels[userType];
  return Model.findOneAndUpdate(userMatch, update, { new: true });
};

export default {
  createUser,
  getUser,
  updateUser,
  userTypes,
};
