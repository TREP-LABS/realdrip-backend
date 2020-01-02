import supertest from 'supertest';
import app from '../../../http/app';
import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const request = supertest(app);

const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

const wardUserDetails = {
  name: 'Test Ward',
  email: 'updateward@test.com',
  label: 'Ward U',
};

const updateUserFields = {
  name: 'Test Ward updated',
  label: 'Ward U',
};

const testCases = [
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/ward/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  confirmAccessLevelRestriction({
    title: 'hospital user should not be able to update a ward account',
    userType: HOSPITAL_ADMIN_USER,
    path: '/api/ward/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  confirmAccessLevelRestriction({
    title: 'nurse user should not be able to update a ward account',
    userType: NURSE_USER,
    path: '/api/ward/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  {
    title: 'should update ward user',
    request: context => ({
      body: updateUserFields,
      path: `/api/ward/${context.wardId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Ward user updated successfully',
        data: {
          _id: expect.any(String),
          name: updateUserFields.name,
          email: expect.any(String),
          label: updateUserFields.label,
          defaultPass: true,
          hospitalId: expect.any(String),
        },
      },
    },
  },
  {
    title: 'should fail if new user name is not a string',
    request: context => ({
      body: { ...updateUserFields, name: 45 },
      path: `/api/ward/${context.wardId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          name: ['"name" must be a string'],
        },
      },
    },
  },
  {
    title: 'should fail if new user name is less than 3 chars',
    request: context => ({
      body: { ...updateUserFields, name: 'me' },
      path: `/api/ward/${context.wardId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          name: ['"name" length must be at least 3 characters long'],
        },
      },
    },
  },
  {
    title: 'should fail if new label is not a string',
    request: context => ({
      body: { ...updateUserFields, label: 45 },
      path: `/api/ward/${context.wardId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          label: ['"label" must be a string'],
        },
      },
    },
  },
  {
    title: 'should fail if ward id request path is not valid',
    request: context => ({
      body: updateUserFields,
      path: '/api/ward/555aa',
      method: 'put',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          wardId: ['"wardId" in query params is not valid'],
        },
      },
    },
  },
];

const context = {};

beforeAll(() => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  return request
    .post('/api/ward')
    .send(wardUserDetails)
    .set('req-token', testGlobals[HOSPITAL_ADMIN_USER].authToken)
    .then((res) => {
      if (!res.body || !res.body.success) {
        throw Error('Ward user creation failed, all other tests in this suite is also expected to fail');
      }
      context.wardId = res.body.data._id;
    });
});

testRunner(testCases, 'Update ward user', context);
