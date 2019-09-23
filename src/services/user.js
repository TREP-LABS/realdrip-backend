import bcrypt from 'bcrypt';
import db from '../db';

const createAdminUser = async (data) => {
  const {
    name, email, location, password,
  } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const alreadyExistingUser = await db.adminUser.getAdminUserByEmail(email);
  if (alreadyExistingUser) {
    const error = new Error('User with this email already exist');
    error.httpStatusCode = 409;
    throw error;
  }
  const adminUser = await db.adminUser.createAdminUser({
    name, email, location, password: hashedPassword, confirmed: false, deviceCount: 0,
  });
  return {
    name: adminUser.name,
    email: adminUser.email,
    // eslint-disable-next-line no-underscore-dangle
    hospitalId: adminUser._id,
    location: adminUser.location,
    confirmed: adminUser.confirmed,
    deviceCount: adminUser.deviceCount,
  };
};

export default {
  createAdminUser,
};
