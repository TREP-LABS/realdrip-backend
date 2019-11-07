import testRunner from '../../utils/testRunner';

// This valid registeration token was manually generated
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VyVHlwZSI6Imhvc3BpdGFsX2FkbWluIiwiaWF0IjoxNTcwMTgyNjk4fQ.Df7sc7J_1vJozqO5UEFU6O_P6BdJ1xzhv-NbuoP-pWk';

const testCases = [
  {
    title: 'should redirect to login page if reg token is valid',
    request: {
      method: 'get',
      path: `/api/hospital/confirmEmail?regToken=${validToken}`,
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
      method: 'get',
      path: '/api/hospital/confirmEmail?regToken=',
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
      method: 'get',
      path: '/api/hospital/confirmEmail?regToken=definatelyInvalidToken',
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

testRunner(testCases, 'Confirm hospital user email address', {});
