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
    title: 'should update infusion successfully',
    request: context => ({
      body: { patientName: 'JP Saxe' },
      path: `/api/infusion/${context.infusionId}`,
      method: 'put',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Device Updated',
        data: {
          // @todo: Having _id instead of id here is a bug, it should be fixed
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
      body: { patientName: 'JP Saxe' },
      path: '/api/infusion/5bbad66374df3900221a55f0',
      method: 'put',
      headers: {
        'req-token': context.testGlobals[WARD_USER].authToken,
      },
    }),
    response: {
      status: 404,
      body: {
        success: false,
        message: 'Device Updated',
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

testRunner(testCases, 'Update infusion endpoint', {});
