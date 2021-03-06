import supertest from 'supertest';
import app from '../../http/app';
import db from '../../db';
import testRunner from '../utils/testRunner';

const { WARD_USER } = db.users.userTypes;

const request = supertest(app);

const infusion = {
  volumeToDispense: 700,
  patientName: 'Tumtum',
  doctorsInstruction: 'This is the doctor\'s instructions and it\'s a string',
  deviceId: '5db95971c9da2412401b1804',
};

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
            _id: expect.any(String),
            volumeToDispense: infusion.volumeToDispense,
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
    title: 'should get all active and ended infusions using url query params',
    request: context => ({
      body: {},
      path: '/api/infusion?status=active&status=ended',
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
            _id: expect.any(String),
            status: 'active',
            volumeToDispense: infusion.volumeToDispense,
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
    title: 'should get all infusions with populated refrence fields',
    request: context => ({
      body: {},
      path: '/api/infusion?populate=wardId,hospitalId',
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
            _id: expect.any(String),
            status: 'active',
            volumeToDispense: infusion.volumeToDispense,
            patientName: infusion.patientName,
            doctorsInstruction: infusion.doctorsInstruction,
            deviceId: infusion.deviceId,
            wardId: expect.any(Object),
            hospitalId: expect.any(Object),
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
          volumeToDispense: infusion.volumeToDispense,
          patientName: infusion.patientName,
          doctorsInstruction: infusion.doctorsInstruction,
          deviceId: expect.any(String),
          wardId: expect.any(String),
          hospitalId: expect.any(String),
        },
      },
    },
  },
  {
    title: 'should get a single infusion with populated refrence fields',
    request: context => ({
      body: {},
      path: `/api/infusion/${context.infusionId}?populate=wardId,hospitalId`,
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
          volumeToDispense: infusion.volumeToDispense,
          patientName: infusion.patientName,
          doctorsInstruction: infusion.doctorsInstruction,
          deviceId: expect.any(String),
          wardId: expect.any(Object),
          hospitalId: expect.any(Object),
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
        message: 'Invalid request data',
        errors: {
          infusionId: ['"infusionId" in query params is not valid'],
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
