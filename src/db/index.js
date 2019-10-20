import mongoose from 'mongoose';
import setup from './setup';
import users from './users';
import device from './device';

setup();

export default {
  users,
  device,
  validResourceId: mongoose.Types.ObjectId.isValid,
};
