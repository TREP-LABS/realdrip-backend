import mongoose from 'mongoose';
import setup from './setup';
import users from './users';
import device from './device';
import infusion from './infusion';

setup();

export default {
  users,
  device,
  infusion,
  validResourceId: mongoose.Types.ObjectId.isValid,
};
