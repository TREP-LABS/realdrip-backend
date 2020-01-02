import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

const updateUserFields = {
  name: 'Updated Hospital User',
  location: {
    country: 'TestCountry2',
    state: 'TestState2',
    address: 'TestAddress2',
  },
};

const testCases = [
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/hospital/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  confirmAccessLevelRestriction({
    title: 'ward user should not be able to update a hospital account',
    userType: WARD_USER,
    path: '/api/hospital/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  confirmAccessLevelRestriction({
    title: 'nurse user should not be able to update a hospital account',
    userType: NURSE_USER,
    path: '/api/hospital/5099803df3f4948bd2f98391',
    method: 'put',
  }),
  {
    title: 'should update hospital user',
    request: context => ({
      method: 'put',
      path: `/api/hospital/${context.testGlobals[HOSPITAL_ADMIN_USER].id}`,
      body: updateUserFields,
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'User updated successfully',
        data: {
          _id: expect.any(String),
          name: updateUserFields.name,
          email: expect.any(String),
          location: updateUserFields.location,
          confirmedEmail: expect.any(Boolean),
          verifiedPurchase: expect.any(Boolean),
        },
      },
    },
  },
  {
    title: 'should fail if user name is less than 3 chars',
    request: context => ({
      method: 'put',
      path: `/api/hospital/${context.testGlobals[HOSPITAL_ADMIN_USER].id}`,
      body: { ...updateUserFields, name: 'me' },
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
    title: 'should fail if new country value is not a string',
    request: context => ({
      method: 'put',
      path: `/api/hospital/${context.testGlobals[HOSPITAL_ADMIN_USER].id}`,
      body: { ...updateUserFields, location: { ...updateUserFields, country: 45 } },
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
          'location.country': ['"location.country" must be a string'],
        },
      },
    },
  },
  {
    title: 'should fail if new state value is not a string',
    request: context => ({
      method: 'put',
      path: `/api/hospital/${context.testGlobals[HOSPITAL_ADMIN_USER].id}`,
      body: { ...updateUserFields, location: { ...updateUserFields, state: 45 } },
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
          'location.state': ['"location.state" must be a string'],
        },
      },
    },
  },
  {
    title: 'should fail if new address value is not a string',
    request: context => ({
      method: 'put',
      path: `/api/hospital/${context.testGlobals[HOSPITAL_ADMIN_USER].id}`,
      body: { ...updateUserFields, location: { ...updateUserFields, address: 45 } },
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
          'location.address': ['"location.address" must be a string'],
        },
      },
    },
  },
];

testRunner(testCases, 'Update hospital user', {});
