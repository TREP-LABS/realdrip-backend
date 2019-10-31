import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';


const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;
const jwtSecrete = process.env.JWT_SECRETE;

const createToken = ({ type, id }) => jwt.sign({ type, id }, jwtSecrete, { expiresIn: '3d' });

let hospitalUser = {
  id: '',
  name: 'Test Hospital User',
  email: 'hospitaluser@test.com',
  password: '',
  location: {
    country: 'TestCountry',
    state: 'TestState',
    address: 'TestAddress',
  },
  confirmedEmail: false,
  verifiedPurchase: false,
};

let wardUser = {
  id: '',
  name: 'Test Ward User',
  email: 'warduser@test.com',
  password: '',
  label: 'Test Ward Label',
  defaultPass: true,
  hospitalId: '',
};

let nurseUser = {
  id: '',
  name: 'Test nurse user',
  email: 'nurseuser@test.com',
  phoneNo: '09088888',
  password: '',
  defaultPass: true,
  wardId: '',
  hospitalId: '',
};

export default async () => {
  const stringPass = 'Password123';
  const hashedpass = await bcrypt.hash(
    stringPass, Number.parseInt(process.env.BCRYPT_HASH_SALT_ROUNDS, 10),
  );
  const { _id: hospitalId } = await db.users.createUser(
    { ...hospitalUser, password: hashedpass }, HOSPITAL_ADMIN_USER,
  );
  const { _id: wardId } = await db.users.createUser(
    { ...wardUser, hospitalId, password: hashedpass }, WARD_USER,
  );
  const { _id: nurseId } = await db.users.createUser({
    ...nurseUser, wardId, hospitalId, password: hashedpass,
  }, NURSE_USER);

  hospitalUser = {
    ...hospitalUser,
    id: hospitalId,
    password: hashedpass,
    stringPass,
    authToken: createToken({ type: HOSPITAL_ADMIN_USER, id: hospitalId }),
  };

  wardUser = {
    ...wardUser,
    id: wardId,
    hospitalId,
    password: hashedpass,
    stringPass,
    authToken: createToken({ type: WARD_USER, id: wardId }),
  };

  nurseUser = {
    ...nurseUser,
    id: nurseId,
    wardId,
    hospitalId,
    password: hashedpass,
    stringPass,
    authToken: createToken({ type: NURSE_USER, id: nurseId }),
  };

  process.env.TEST_GLOBALS = JSON.stringify({
    hospitalUser,
    wardUser,
    nurseUser,
  });
};
