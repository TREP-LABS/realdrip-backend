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

export default {
  createUser,
  getUserByEmail,
  userTypes,
};
