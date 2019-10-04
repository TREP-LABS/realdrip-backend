import userModels from './models';
import * as userTypes from './userTypes';

const createUser = async (userData, userType) => {
  const Model = userModels[userType];
  return new Model(userData).save();
};

const getUserByEmail = async (email, userType) => {
  const Model = userModels[userType];
  return Model.findOne({ email });
};

/**
 * @description Updates user data in the database
 * @param {string} email The email of the user to update
 * @param {object} update The data to patch with the existing user data
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const updateUser = async (email, update, userType) => {
  const Model = userModels[userType];
  return Model.updateOne({ email }, update);
};

export default {
  createUser,
  getUserByEmail,
  updateUser,
  userTypes,
};
