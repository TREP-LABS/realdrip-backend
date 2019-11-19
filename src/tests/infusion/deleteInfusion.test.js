import supertest from 'supertest';
import app from '../../http/app';
import db from '../../db';
import testRunner from '../utils/testRunner';
import confirmAccessLevelRestriction from '../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../genericTestCases/confirmAuthRestriction';

const { WARD_USER, NURSE_USER } = db.users.userTypes;

const request = supertest(app);

const infusion = {
  startVolume: 700,
  stopVolume: 50,
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
  confirmAccessLevelRestriction({
    title: 'Nurse user should not be able to delete infusion',
    userType: NURSE_USER,
    path: '/api/infusion',
    method: 'post',
  }),
  {
    title: 'should delete infusion',
    request: context => ({
      body: {},
      path: `/api/infusion/${context.infusionId}`,
      method: 'delete',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 204,
      body: {},
    },
  },
  {
    title: 'should fail to delete infusion if the infusionId is invalid',
    request: context => ({
      body: {},
      path: '/api/infusion/2ad3flk',
      method: 'delete',
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
        throw Error('Deleting infusion failed, all other tests in this suite is also expected to fail');
      }
      context.infusionId = res.body.data._id;
    });
});

testRunner(testCases, 'Delete infusion', context);
