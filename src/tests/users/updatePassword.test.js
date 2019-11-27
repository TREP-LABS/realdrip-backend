import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../db';
import testRunner from '../utils/testRunner';
import confirmAuthRestriction from '../genericTestCases/confirmAuthRestriction';

const { WARD_USER, HOSPITAL_ADMIN_USER } = db.users.userTypes;

const jwtSecrete = process.env.JWT_SECRETE;

const createToken = ({ type, id }) => jwt.sign({ type, id }, jwtSecrete, { expiresIn: '3d' });
const wardUser = {
  id: '',
  name: 'Test Ward User',
  email: 'anotherWarduser@test.com',
  password: '',
  label: 'Another Test Ward Label',
  defaultPass: true,
  hospitalId: '',
};

const testCases = [
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/ward',
    method: 'post',
  }),
  {
    title: 'should update user password',
    request: context => ({
      method: 'put',
      path: `/api/users/${context.ward._id}/password`,
      body: { formerPassword: context.ward.stringPass, newPassword: 'Password1234' },
      headers: {
        'req-token': context.ward.authToken,
      },
    }),
    response: {
      status: 204,
      body: {},
    },
  },
  {
    title: 'should fail if new password does not contain an uppercase letter',
    request: context => ({
      method: 'put',
      path: `/api/users/${context.ward._id}/password`,
      body: { formerPassword: 'Password123', newPassword: 'password1234' },
      headers: {
        'req-token': context.ward.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request',
        errors: {
          newPassword: ['New password must be at least 7 character mix of capital, small letters with numbers'],
        },
      },
    },
  },
  {
    title: 'should fail if new password does not contain a number',
    request: context => ({
      method: 'put',
      path: `/api/users/${context.ward._id}/password`,
      body: { formerPassword: 'Password123', newPassword: 'passworD' },
      headers: {
        'req-token': context.ward.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request',
        errors: {
          newPassword: ['New password must be at least 7 character mix of capital, small letters with numbers'],
        },
      },
    },
  },
  {
    title: 'should fail if Former password is incorrect',
    request: context => ({
      method: 'put',
      path: `/api/users/${context.ward._id}/password`,
      body: { formerPassword: 'Passwor3', newPassword: 'passworD223' },
      headers: {
        'req-token': context.ward.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Former password is not correct',
      },
    },
  },
  {
    title: 'should fail if the user is not found',
    request: context => ({
      method: 'put',
      path: '/api/users/5db95971c9da2412401b1804/password',
      body: { formerPassword: context.ward.stringPass, newPassword: 'passworD223' },
      headers: {
        'req-token': context.ward.authToken,
      },
    }),
    response: {
      status: 404,
      body: {
        success: false,
        message: 'User does not exist',
      },
    },
  },
  {
    title: 'should fail if former password or new password is not a string',
    request: context => ({
      method: 'put',
      path: `/api/users/${context.ward._id}/password`,
      body: { formerPassword: 55289099, newPassword: 55555582 },
      headers: {
        'req-token': context.ward.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request',
        errors: {
          formerPassword: ['Former password is a required string'],
          newPassword: ['New password is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if req-token is not in the header',
    request: context => ({
      method: 'put',
      path: `/api/users/${context.ward._id}/password`,
      body: { formerPassword: context.ward.stringPass, newPassword: 'passworD223' },
      headers: {
        Auth: context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 401,
      body: {
        success: false,
        message: 'Unable to authenticate token',
      },
    },
  },
];

const context = {};

beforeAll(async () => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  const stringPass = 'Password123';
  const hashedpass = await bcrypt.hash(
    stringPass, Number.parseInt(process.env.BCRYPT_HASH_SALT_ROUNDS, 10),
  );
  const ward = await db.users.createUser(
    {
      ...wardUser,
      hospitalId: testGlobals[HOSPITAL_ADMIN_USER].id,
      password: hashedpass,
    }, WARD_USER,
  );
  context.ward = {
    ...ward, _id: ward._id, stringPass, authToken: createToken({ type: WARD_USER, id: ward._id }),
  };
});

testRunner(testCases, 'Update user password', context);
