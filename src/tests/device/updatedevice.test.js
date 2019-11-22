import db from '../../db';
import testRunner from '../utils/testRunner';
import confirmAccessLevelRestriction from '../genericTestCases/confirmAccessLevelRestriction';

const { HOSPITAL_ADMIN_USER, NURSE_USER } = db.users.userTypes;

const testCases = [
  confirmAccessLevelRestriction({
    title: 'nurse user should not be able to update a device',
    userType: NURSE_USER,
    path: '/api/devices/5bbad66374df3900221a55f0',
    method: 'put',
  }),
  {
    title: 'should update device',
    request: context => ({
      method: 'put',
      path: `/api/devices/${context.deviceId}`,
      body: { label: 'red label' },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Device updated',
        data: {
          _id: expect.any(String),
          label: 'red label',
          hospitalId: expect.any(String),
        },
      },
    },
  },
  {
    title: 'should fail if device is not found in the db',
    request: context => ({
      method: 'put',
      path: '/api/devices/5bbad66374df3900221a53f0',
      body: { label: 'red rabel' },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 404,
      body: {
        success: false,
        message: 'Unable to update device',
      },
    },
  },
  {
    title: 'should fail if device label is already in use',
    request: context => ({
      method: 'put',
      path: '/api/devices/5bbad66374df3900221a53f0',
      body: { label: 'red label' },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Label already in use. try a different one',
      },
    },
  },
  {
    title: 'should fail if device id not valid',
    request: context => ({
      method: 'put',
      path: '/api/devices/221a55f0',
      body: { label: 'red label' },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request',
        errors: {
          deviceId: ['deviceId is not valid'],
        },
      },
    },
  },
  {
    title: 'should fail if the label field sent was not a string',
    request: context => ({
      method: 'put',
      path: '/api/devices/221a55f0',
      body: { label: 6785 },
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request',
        errors: {
          label: ['label is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if an empty body was sent',
    request: context => ({
      method: 'put',
      path: '/api/devices/221a55f0',
      body: {},
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request: All fields can\'t be empty',
      },
    },
  },
  {
    title: 'should fail if req-token is not in the header',
    request: context => ({
      method: 'put',
      path: `/api/devices/${context.deviceId}`,
      body: { label: 'red label' },
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

  const device = await db.device.createDevice({
    hospitalId: testGlobals[HOSPITAL_ADMIN_USER].id,
    label: 'something nice',
  });
  context.deviceId = device._id;
});

testRunner(testCases, 'Update device endpoint', context);
