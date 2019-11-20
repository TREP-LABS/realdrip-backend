import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

const nurseUserDetails = {
  name: 'Test Nurse',
  email: 'createnurse@test.com',
  phoneNo: '0907888667',
};

const path = '/api/nurse';

const testCases = [
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/nurse',
    method: 'post',
  }),
  confirmAccessLevelRestriction({
    title: 'hospital user should not be able to create a nurse user',
    userType: HOSPITAL_ADMIN_USER,
    path: '/api/nurse',
    method: 'post',
  }),
  confirmAccessLevelRestriction({
    title: 'nurse user should not be able to create a nurse user',
    userType: NURSE_USER,
    path: '/api/nurse',
    method: 'post',
  }),
  {
    title: 'should create a nurse user',
    request: context => ({
      path,
      method: 'post',
      body: nurseUserDetails,
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 201,
      body: {
        success: true,
        message: 'Nurse user created successfully',
        data: {
          _id: expect.any(String),
          name: nurseUserDetails.name,
          email: nurseUserDetails.email,
          phoneNo: nurseUserDetails.phoneNo,
          wardId: expect.any(String),
          hospitalId: expect.any(String),
          defaultPass: true,
        },
      },
    },
  },
  {
    title: 'should fail if nurse user with the same email already exist',
    request: context => ({
      path,
      method: 'post',
      body: {
        ...nurseUserDetails,
        email: context.testGlobals[NURSE_USER].email,
      },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 409,
      body: {
        success: false,
        message: 'Nurse user with this email already exist',
      },
    },
  },
  {
    title: 'should fail if user name is not in request body',
    request: context => ({
      path,
      method: 'post',
      body: { ...nurseUserDetails, name: undefined },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          name: ['Nurse name is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if user name is less than 3 chars',
    request: context => ({
      path,
      method: 'post',
      body: { ...nurseUserDetails, name: 'me' },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          name: ['Nurse name must be at least 3 characters'],
        },
      },
    },
  },
  {
    title: 'should fail if user email is not in request body',
    request: context => ({
      path,
      method: 'post',
      body: { ...nurseUserDetails, email: undefined },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          email: ['Nurse email is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if user email is not a valid email address',
    request: context => ({
      path,
      method: 'post',
      body: { ...nurseUserDetails, email: 'testtt.com' },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          email: ['Nurse email format is not valid'],
        },
      },
    },
  },
  {
    title: 'should fail if user phone no is not a string',
    request: context => ({
      path,
      method: 'post',
      body: { ...nurseUserDetails, phoneNo: 17 },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          phoneNo: ['phoneNo is a required string'],
        },
      },
    },
  },
];

testRunner(testCases, 'Create nurse user', {});
