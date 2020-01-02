import supertest from 'supertest';
import app from '../../../http/app';
import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const request = supertest(app);

const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

const nurseUserDetails = {
  name: 'Test Update Nurse',
  email: 'updatenurse@test.com',
  phoneNo: '0907888667',
};

const updateUserFields = {
  name: 'Test Nurse updated',
  phoneNo: '0807776662',
};

const testCases = [
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/nurse/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  confirmAccessLevelRestriction({
    title: 'hospital user should not be able to update a nurse account',
    userType: HOSPITAL_ADMIN_USER,
    path: '/api/nurse/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  confirmAccessLevelRestriction({
    title: 'ward user should not be able to update a nurse account',
    userType: WARD_USER,
    path: '/api/nurse/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  {
    title: 'should update nurse user',
    request: context => ({
      body: updateUserFields,
      path: `/api/nurse/${context.nurseId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[NURSE_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Nurse user updated successfully',
        data: {
          _id: expect.any(String),
          name: updateUserFields.name,
          email: expect.any(String),
          phoneNo: updateUserFields.phoneNo,
          defaultPass: true,
          wardId: expect.any(String),
          hospitalId: expect.any(String),
        },
      },
    },
  },
  {
    title: 'should fail if new user name is not a string',
    request: context => ({
      body: { ...updateUserFields, name: 45 },
      path: `/api/nurse/${context.nurseId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[NURSE_USER].authToken,
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
      path: `/api/nurse/${context.nurseId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[NURSE_USER].authToken,
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
    title: 'should fail if new phoneNo is not a string',
    request: context => ({
      body: { ...updateUserFields, phoneNo: 45 },
      path: `/api/nurse/${context.nurseId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[NURSE_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          phoneNo: ['"phoneNo" must be a string'],
        },
      },
    },
  },
  {
    title: 'should fail if nurseId in request path is not valid',
    request: context => ({
      body: updateUserFields,
      path: '/api/nurse/555aa',
      method: 'put',
      headers: {
        'req-token': context.testGlobals[NURSE_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          nurseId: ['"nurseId" in query params is not valid'],
        },
      },
    },
  },
];

const context = {};

beforeAll(() => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  return request
    .post('/api/nurse')
    .send(nurseUserDetails)
    .set('req-token', testGlobals[WARD_USER].authToken)
    .then((res) => {
      if (!res.body || !res.body.success) {
        throw Error('Nurse user creation failed, all other tests in this suite is also expected to fail');
      }
      context.nurseId = res.body.data._id;
    });
});

testRunner(testCases, 'Update nurse user', context);
