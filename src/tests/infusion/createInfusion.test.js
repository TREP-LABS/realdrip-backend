import db from '../../db';
import testRunner from '../utils/testRunner';

const { WARD_USER, NURSE_USER } = db.users.userTypes;

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
          startVolume: infusion.startVolume,
          stopVolume: infusion.stopVolume,
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
    title: 'creation of infusion should fail for a nurse user',
    request: context => ({
      path: '/api/infusion',
      method: 'post',
      body: infusion,
      headers: {
        'req-token': context.testGlobals[NURSE_USER].authToken,
      },
    }),
    response: {
      status: 403,
      body: {
        success: false,
        message: 'You do not have access to this endpoint',
      },
    },
  },
  {
    title: 'creation of infusion should fail if some of the required data such as patientName is missing',
    request: context => ({
      path: '/api/infusion',
      method: 'post',
      body: {
        startVolume: 700,
        stopVolume: 50,
        doctorsInstruction: 'This is the doctor\'s instructions and it\'s a string',
        deviceId: '5db95971c9da2412401b1804',
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
        },
      },
    },
  },
];

testRunner(testCases, 'Create infusion endpoint', {});
