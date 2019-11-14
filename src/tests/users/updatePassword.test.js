import db from '../../db';
import testRunner from '../utils/testRunner';

const { WARD_USER } = db.users.userTypes;

const testCases = [
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
];

testRunner(testCases, 'Update user password', {});
