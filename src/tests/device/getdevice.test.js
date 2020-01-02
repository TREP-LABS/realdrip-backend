import db from '../../db';
import testRunner from '../utils/testRunner';

const { HOSPITAL_ADMIN_USER } = db.users.userTypes;

const testCases = [
  {
    title: 'should get all devices',
    request: context => ({
      body: {},
      path: '/api/devices',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Devices found',
        data: expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            label: expect.any(String),
            hospitalId: expect.any(String),
          }),
        ]),
      },
    },
  },
  {
    title: 'should get a single device',
    request: context => ({
      body: {},
      path: `/api/devices/${context.deviceId}`,
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Device found',
        data: expect.objectContaining({
          _id: expect.any(String),
          label: expect.any(String),
          hospitalId: expect.any(String),
        }),
      },
    },
  },
  {
    title: 'should fail if the device is not found',
    request: context => ({
      body: {},
      path: '/api/devices/5db84960166c41363822ca25',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 404,
      body: {
        success: false,
        message: 'Device not found',
      },
    },
  },
  {
    title: 'should fail if the device id is not valid',
    request: context => ({
      body: {},
      path: '/api/devices/5db84',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        message: 'Invalid request data',
        errors: {
          deviceId: ['"deviceId" in query params is not valid'],
        },
      },
    },
  },
  {
    title: 'should fail if request token is not in the header',
    request: context => ({
      body: {},
      path: '/api/devices/5db84960166c41363822ca25',
      method: 'get',
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

testRunner(testCases, 'Get Devices', context);
