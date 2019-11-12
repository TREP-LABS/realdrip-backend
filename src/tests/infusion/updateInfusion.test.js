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

// @todo: Additional test cases are to be added to test
// for other scenarios this endpoint is to handle
const testCases = [

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

test('Updating of infusion should succeed if the infusion details is valid', (done) => {
  request
    .put(`/api/infusion/${context.infusionId}`)
    .set('req-token', testGlobals[WARD_USER].authToken)
    .send({ patientName: 'Abeeb' })
    .end((err, res) => {
      expect(res.status).toBe(200);
      done();
    });
});
testRunner(testCases, 'Update infusion endpoint', {});
