import db from '../../db';
import testRunner from '../utils/testRunner';
import confirmAuthRestriction from '../genericTestCases/confirmAuthRestriction';

const { WARD_USER, NURSE_USER } = db.users.userTypes;

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
      path: `/api/users/${context.testGlobals[WARD_USER].id}/password`,
      body: { formerPassword: 'Password123', newPassword: 'Password1234' },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
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
      path: `/api/users/${context.testGlobals[WARD_USER].id}/password`,
      body: { formerPassword: 'Password123', newPassword: 'password1234' },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
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
      path: `/api/users/${context.testGlobals[WARD_USER].id}/password`,
      body: { formerPassword: 'Password123', newPassword: 'passworD' },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
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
      path: `/api/users/${context.testGlobals[WARD_USER].id}/password`,
      body: { formerPassword: 'Passwor3', newPassword: 'passworD223' },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
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
      path: `/api/users/${context.testGlobals[WARD_USER].id}/password`,
      body: { formerPassword: 'Passwor3', newPassword: 'passworD223' },
      headers: {
        'req-token': context.testGlobals[NURSE_USER].authToken,
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
      path: `/api/users/${context.testGlobals[WARD_USER].id}/password`,
      body: { formerPassword: 55289099, newPassword: 55555582 },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
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
];

testRunner(testCases, 'Update user password', {});
