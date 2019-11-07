import db from '../../db';
import testRunner from '../utils/testRunner';

const { WARD_USER } = db.users.userTypes;

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
          // @todo: Having _id instead of id here is a bug, it should be fixed
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
];

testRunner(testCases, 'Create infusion endpoint', {});
