import supertest from 'supertest';
import app from '../../http/app';

const request = supertest(app);

const loginDetails = hospitalUser => ({
  email: hospitalUser.email,
  password: hospitalUser.stringPass,
  userType: 'hospital_admin',
});


const testCases = [
  {
    title: 'should log user in succcessfully',
    request: context => ({
      body: loginDetails(context.testGlobals.hospitalUser),
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Login successfully',
        data: {
          user: {
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            location: expect.any(Object),
            confirmedEmail: expect.any(Boolean),
            verifiedPurchase: expect.any(Boolean),
          },
          token: expect.any(String),
        },
      },
    },
  },
  {
    title: 'should fail if user email is not provided',
    request: context => ({
      body: { ...loginDetails(context.testGlobals.hospitalUser), email: undefined },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          email: ['Userr email is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if user email is not a valid email address',
    request: context => ({
      body: { ...loginDetails(context.testGlobals.hospitalUser), email: 'testt.com' },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          email: ['User email format is a not valid'],
        },
      },
    },
  },
  {
    title: 'should fail if user does not exist',
    request: context => ({
      body: { ...loginDetails(context.testGlobals.hospitalUser), email: 'randomerandomeuser@gmail.com' },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Email or password incorrect',
      },
    },
  },
  {
    title: 'should fail if user password is not provided',
    request: context => ({
      body: { ...loginDetails(context.testGlobals.hospitalUser), password: undefined },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          password: ['Password field is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if user password is not correct',
    request: context => ({
      body: { ...loginDetails(context.testGlobals.hospitalUser), password: `${context.testGlobals.hospitalUser.stringPass}--` },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Email or password incorrect',
      },
    },
  },
  {
    title: 'should fail if user type is not valid',
    request: context => ({
      body: { ...loginDetails(context.testGlobals.hospitalUser), userType: 'random_user_type' },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          userType: ['userType field must be one of the following: hospital_admin, ward_user, nurse_user'],
        },
      },
    },
  },
];

const testTable = testCases.map(testCase => [testCase.title, testCase.request, testCase.response]);

const hospitalUserEndpoint = '/api/users/login';

test.each(testTable)('Log user in: %s', (title, reqData, resData) => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  const reqContext = { testGlobals };
  let processedReqData;
  if (typeof reqData === 'function') {
    processedReqData = reqData(reqContext);
  } else processedReqData = reqData;
  return request
    .post(hospitalUserEndpoint)
    .send(processedReqData.body || {})
    .set(processedReqData.headers || {})
    .then((res) => {
      expect(res.status).toBe(resData.status);
      expect(res.body).toMatchObject(resData.body);
    });
});
