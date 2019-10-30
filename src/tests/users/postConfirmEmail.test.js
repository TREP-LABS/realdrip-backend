import supertest from 'supertest';
import app from '../../http/app';

const request = supertest(app);

// This valid registeration token was manually generated
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VyVHlwZSI6Imhvc3BpdGFsX2FkbWluIiwiaWF0IjoxNTcwMTgyNjk4fQ.Df7sc7J_1vJozqO5UEFU6O_P6BdJ1xzhv-NbuoP-pWk';

const testCases = [
  {
    title: 'should redirect to login page if token is reg token is valid',
    request: {
      endpoint: `/api/hospital/confirmEmail?regToken=${validToken}`,
    },
    response: {
      status: 302,
      body: {},
      header: {
        location: expect.stringMatching(/\/login/),
      },
    },
  },
  {
    title: 'should fail if a reg token is not provided in query params',
    request: {
      endpoint: '/api/hospital/confirmEmail?regToken=',
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request',
        errors: {
          regToken: ['regToken is a required query parameter'],
        },
      },
    },
  },
  {
    title: 'should fail if reg token is not valid',
    request: {
      endpoint: '/api/hospital/confirmEmail?regToken=definatelyInvalidToken',
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Registeration token not valid',
      },
    },
  },
];

const testTable = testCases.map(testCase => [testCase.title, testCase.request, testCase.response]);

test.each(testTable)('Confirm hospital user email address: %s', (title, reqData, resData) => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  const reqContext = { testGlobals };
  let processedReqData;
  if (typeof reqData === 'function') {
    processedReqData = reqData(reqContext);
  } else processedReqData = reqData;
  return request
    .get(processedReqData.endpoint)
    .send(processedReqData.body || {})
    .set(processedReqData.headers || {})
    .then((res) => {
      expect(res.status).toBe(resData.status);
      expect(res.header).toMatchObject(resData.header || {});
      expect(res.body).toMatchObject(resData.body);
    });
});
