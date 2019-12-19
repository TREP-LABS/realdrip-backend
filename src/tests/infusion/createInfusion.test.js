import db from '../../db';
import testRunner from '../utils/testRunner';
import confirmAuthRestriction from '../genericTestCases/confirmAuthRestriction';

const { WARD_USER } = db.users.userTypes;

const infusion = {
  volumeToDispense: 700,
  patientName: 'Tumtum',
  doctorsInstruction: 'This is the doctor\'s instructions and it\'s a string',
  deviceId: '5db95971c9da2412401b1804',
};

const testCases = [
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/infusion',
    method: 'post',
  }),
  {
    title: 'should create infusion successfully',
    request: context => ({
      body: infusion,
      path: '/api/infusion',
      method: 'post',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 201,
      body: {
        success: true,
        message: 'Infusion created',
        data: {
          _id: expect.any(String),
          volumeToDispense: infusion.volumeToDispense,
          status: 'active',
          patientName: infusion.patientName,
          doctorsInstruction: infusion.doctorsInstruction,
          deviceId: infusion.deviceId,
          wardId: expect.any(String),
          hospitalId: expect.any(String),
        },
      },
    },
  },
  {
    title: 'creation of infusion should fail if some of the required credentials is not provided',
    request: context => ({
      path: '/api/infusion',
      method: 'post',
      body: {},
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
          volumeToDispense: ['volumeToDispense is a required number'],
          doctorsInstruction: ['doctorsInstruction is a required string'],
          deviceId: ['deviceId is required'],
        },
      },
    },
  },
  {
    title: 'creation of infusion should fail if the deviceId is not valid',
    request: context => ({
      path: '/api/infusion',
      method: 'post',
      body: { ...infusion, deviceId: 'sddfadf5' },
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
          deviceId: ['Invalid deviceId'],
        },
      },
    },
  },
  {
    title: 'creation of infusion should fail if the volumeToDispense is not a number',
    request: context => ({
      path: '/api/infusion',
      method: 'post',
      body: { ...infusion, volumeToDispense: '100ml' },
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
          volumeToDispense: ['volumeToDispense is a required number'],
        },
      },
    },
  },
];

testRunner(testCases, 'Create infusion endpoint', {});
