import db from '../../../db';
import testRunner from '../../utils/testRunner';


const { HOSPITAL_ADMIN_USER } = db.users.userTypes;


const updateUserFields = {
  name: 'Updated Hospital User',
  location: {
    country: 'TestCountry2',
    state: 'TestState2',
    address: 'TestAddress2',
  },
};

const path = '/api/hospital';

const testCases = [
  {
    title: 'should update hospital user',
    request: context => ({
      method: 'put',
      path,
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
          id: expect.any(String),
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
      path,
      body: { ...updateUserFields, name: 'me' },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          name: ['Medical center name must be at least 3 characters'],
        },
      },
    },
  },
  {
    title: 'should fail if new country value is not a string',
    request: context => ({
      method: 'put',
      path,
      body: { ...updateUserFields, location: { ...updateUserFields, country: 45 } },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          'location.country': ['Country field is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if new state value is not a string',
    request: context => ({
      method: 'put',
      path,
      body: { ...updateUserFields, location: { ...updateUserFields, state: 45 } },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          'location.state': ['State field is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if new address value is not a string',
    request: context => ({
      method: 'put',
      path,
      body: { ...updateUserFields, location: { ...updateUserFields, address: 45 } },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          'location.address': ['Address field is a required string'],
        },
      },
    },
  },
];

testRunner(testCases, 'Update hospital user', {});
