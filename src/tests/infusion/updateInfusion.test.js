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
  deviceId: '5db23403347ab06cc7bfd8a2',
};

const testCases = [

  {
    title: 'should update infusion',
    request: context => ({
      method: 'put',
      path: `/api/infusion/${context.infusionId}`,
      body: { patientName: 'JP Saxe' },
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Infusion updated',
        data: {
          _id: expect.any(String),
          startVolume: infusion.startVolume,
          stopVolume: infusion.stopVolume,
          patientName: 'JP Saxe',
          doctorsInstruction: infusion.doctorsInstruction,
          deviceId: infusion.deviceId,
          wardId: expect.any(String),
          hospitalId: expect.any(String),
        },
      },
    },
  },
  {
    title: 'should fail to update infusion if the infusion is not found',
    request: context => ({
      method: 'put',
      path: '/api/infusion/5bbad66374df3900221a55f0',
      body: { patientName: 'JP Saxe' },
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
    title: 'should fail to update infusion if the infusionId is invalid',
    request: context => ({
      method: 'put',
      path: '/api/infusion/5bbad66',
      body: { patientName: 'JP Saxe' },
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
          infusionId: ['infusionId is not valid'],
        },
      },
    },
  },
  {
    title: 'should fail to update if an empty request body is provided',
    request: context => ({
      path: `/api/infusion/${context.infusionId}`,
      method: 'put',
      body: {},
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
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
    title: 'should fail to update infusion if the dataTypes sent are different from expected',
    request: context => ({
      path: `/api/infusion/${context.infusionId}`,
      method: 'put',
      body: {
        startVolume: '700ml',
        stopVolume: '50ml',
        patientName: 25,
        doctorsInstruction: 989,
      },
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
          patientName: ['patientName is a required string'],
          startVolume: ['startVolume is a required number'],
          stopVolume: ['stopVolume is a required number'],
          doctorsInstruction: ['doctorsInstruction is a required string'],
        },
      },
    },
  },
];

const context = {};
const testGlobals = JSON.parse(process.env.TEST_GLOBALS);

beforeAll(() => request
  .post('/api/infusion')
  .send(infusion)
  .set('req-token', testGlobals[WARD_USER].authToken)
  .then((res) => {
    if (!res.body || !res.body.success) {
      throw Error('Infusion creation failed, all other tests in this suite is also expected to fail');
    }
    context.infusionId = res.body.data._id;
  }));

testRunner(testCases, 'Update infusion endpoint', context);
