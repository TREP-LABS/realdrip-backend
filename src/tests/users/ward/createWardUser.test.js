import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

const wardUserDetails = {
  name: 'Test Ward',
  email: 'createward@test.com',
  label: 'Ward T',
};

const path = '/api/ward';

const testCases = [
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/ward',
    method: 'post',
  }),
  confirmAccessLevelRestriction({
    title: 'ward user should not be able to create a ward account',
    userType: WARD_USER,
    path: '/api/ward',
    method: 'post',
  }),
  confirmAccessLevelRestriction({
    title: 'nurse user should not be able to create a ward account',
    userType: NURSE_USER,
    path: '/api/ward',
    method: 'post',
  }),
  {
    title: 'should create a ward user',
    request: context => ({
      path,
      method: 'post',
      body: wardUserDetails,
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 201,
      body: {
        success: true,
        message: 'Ward user created successfully',
        data: {
          _id: expect.any(String),
          name: wardUserDetails.name,
          email: wardUserDetails.email,
          label: wardUserDetails.label,
          hospitalId: expect.any(String),
          defaultPass: true,
        },
      },
    },
  },
  {
    title: 'should fail if ward user with the same email already exist',
    request: context => ({
      path,
      method: 'post',
      body: {
        ...wardUserDetails,
        email: context.testGlobals[WARD_USER].email,
      },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 409,
      body: {
        success: false,
        message: 'Ward user with this email already exist',
      },
    },
  },
  {
    title: 'should fail if user name is not in request body',
    request: context => ({
      path,
      method: 'post',
      body: { ...wardUserDetails, name: undefined },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          name: ['"name" is required'],
        },
      },
    },
  },
  {
    title: 'should fail if user name is less than 3 chars',
    request: context => ({
      path,
      method: 'post',
      body: { ...wardUserDetails, name: 'me' },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
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
    title: 'should fail if user email is not in request body',
    request: context => ({
      path,
      method: 'post',
      body: { ...wardUserDetails, email: undefined },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          email: ['"email" is required'],
        },
      },
    },
  },
  {
    title: 'should fail if user email is not a valid email address',
    request: context => ({
      path,
      method: 'post',
      body: { ...wardUserDetails, email: 'testtt.com' },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          email: ['"email" must be a valid email'],
        },
      },
    },
  },
  {
    title: 'should fail if ward label is not a string',
    request: context => ({
      path,
      method: 'post',
      body: { ...wardUserDetails, label: 17 },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
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
];

testRunner(testCases, 'Create ward user', {});
