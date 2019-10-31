import supertest from 'supertest';
import app from '../../http/app';

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
      endpoint: '/api/infusion',
      headers: {
        'req-token': context.testGlobals.wardUser.authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Infusions found',
        data: [{
          // @todo: Having _id instead of id here is a bug, it should be fixed
          _id: expect.any(String),
          startVolume: infusion.startVolume,
          stopVolume: infusion.stopVolume,
          patientName: infusion.patientName,
          doctorsInstruction: infusion.doctorsInstruction,
          deviceId: infusion.deviceId,
          wardId: expect.any(String),
          hospitalId: expect.any(String),
        }],
      },
    },
  },
  // This test case is added here even when the get single infusion endpoint is not implemented
  // just to demonstrate how to go about creating a test case for getting single infusion
  {
    title: 'should get a single infusion',
    request: context => ({
      body: {},
      endpoint: `/api/infusion/${context.infusionId}`,
      headers: {
        'req-token': context.testGlobals.wardUser.authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Infusion found',
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

const testTable = testCases.map(testCase => [testCase.title, testCase.request, testCase.response]);

const infusionEndpoint = '/api/infusion';
let infusionId = null;

beforeAll(() => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  return request
    .post(infusionEndpoint)
    .send(infusion)
    .set('req-token', testGlobals.wardUser.authToken)
    .then((res) => {
      if (!res.body || !res.body.success) {
        throw Error('Infusion creation failed, all other tests in this suite is also expected to fail');
      }
      // @todo: Having _id instead of id here is a bug, it should be fixed
      infusionId = res.body.data._id;
    });
});


test.each(testTable)('Get Infusion Endpoint: %s', (title, reqData, resData) => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  const reqContext = { testGlobals, infusionId };
  let processedReqData;
  if (typeof reqData === 'function') {
    processedReqData = reqData(reqContext);
  } else processedReqData = reqData;
  return request
    .get(processedReqData.endpoint || infusion)
    .send(processedReqData.body || {})
    .set(processedReqData.headers || {})
    .then((res) => {
      expect(res.status).toBe(resData.status);
      expect(res.body).toMatchObject(resData.body);
    });
});
