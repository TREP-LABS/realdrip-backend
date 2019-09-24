import mongoose from 'mongoose';
import setup from './setup';
import models from './models';
import schemas from './schemas';

setup();

const adminUser = new models.AdminUser(mongoose.model('AdminUser', schemas.AdminUserSchema));
const verifyDevice = new models.Device(mongoose.model('VerifyDevice', schemas.verifyDeviceSchema));

export default {
  adminUser,
  verifyDevice
};
