import supertest from 'supertest';
import app from '../../http/app';
import db from '../../db';
import testRunner from '../utils/testRunner';

const { WARD_USER } = db.users.userTypes;

const request = supertest(app);

const infusion = {
  startVolume: 700,
  stopVolume: 50,
  patientName: 'Tumtum',
  doctorsInstruction: 'This is the doctor\'s instructions and it\'s a string',
  deviceId: '5db95971c9da2412401b1804',
};

// @todo: Additional test cases are to be added to test
// for other scenarios this endpoint is to handle
const testCases = [
  {
    title: 'should get all infusions',
    request: context => ({
      body: {},
      path: '/api/infusion',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Infusions found',
        data: expect.arrayContaining([
          expect.objectContaining({
            // @todo: Having _id instead of id here is a bug, it should be fixed
            _id: expect.any(String),
            startVolume: infusion.startVolume,
            stopVolume: infusion.stopVolume,
            patientName: infusion.patientName,
            doctorsInstruction: infusion.doctorsInstruction,
            deviceId: infusion.deviceId,
            wardId: expect.any(String),
            hospitalId: expect.any(String),
          }),
        ]),
      },
    },
  },
  {
    title: 'should get a single infusion',
    request: context => ({
      body: {},
      path: `/api/infusion/${context.infusionId}`,
      method: 'get',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Infusion found',
        data: {
          _id: expect.any(String),
          startVolume: infusion.startVolume,
          stopVolume: infusion.stopVolume,
          patientName: infusion.patientName,
          doctorsInstruction: infusion.doctorsInstruction,
          // Since the device is not valid null will be returned.
          // Testing the deviceId then is invalid
          wardId: expect.any(Object),
          hospitalId: expect.any(String),
        },
      },
    },
  },
  {
    title: 'should fail to get single infusion if infusionId is not valid',
    request: context => ({
      body: {},
      path: '/api/infusion/555aa',
      method: 'get',
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
          infusionId: ['infusionId is not valid.'],
        },
      },
    },
  },
  {
    title: 'should fail to get single infusion if infusion is not in the database',
    request: context => ({
      body: {},
      path: '/api/infusion/5db84960166c41363822ca25',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 404,
      body: {
        success: false,
        message: 'Infusion not found',
      },
    },
  },
  {
    title: 'should fail to get infusion if the req-token is not part of the header',
    request: context => ({
      body: {},
      path: '/api/infusion/555aa',
      method: 'get',
      headers: {
        Auth: context.testGlobals[WARD_USER].authToken,
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

beforeAll(() => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  return request
    .post('/api/infusion')
    .send(infusion)
    .set('req-token', testGlobals[WARD_USER].authToken)
    .then((res) => {
      if (!res.body || !res.body.success) {
        throw Error('Infusion creation failed, all other tests in this suite is also expected to fail');
      }
      context.infusionId = res.body.data._id;
    });
});

testRunner(testCases, 'Get infusion', context);
