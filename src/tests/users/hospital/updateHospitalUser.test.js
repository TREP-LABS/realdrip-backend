import supertest from 'supertest';
import app from '../../../http/app';

const request = supertest(app);

const updateUserFields = {
  name: 'Updated Hospital User',
  location: {
    country: 'TestCountry2',
    state: 'TestState2',
    address: 'TestAddress2',
  },
};

const testCases = [
  {
    title: 'should update hospital user',
    request: context => ({
      body: updateUserFields,
      headers: {
        'req-token': context.testGlobals.hospitalUser.authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'User updated successfully',
        data: {
          id: expect.any(String),
          name: updateUserFields.name,
          email: expect.any(String),
          location: updateUserFields.location,
          confirmedEmail: expect.any(Boolean),
          verifiedPurchase: expect.any(Boolean),
        },
      },
    },
  },
  {
    title: 'should fail if user name is less than 3 chars',
    request: context => ({
      body: { ...updateUserFields, name: 'me' },
      headers: {
        'req-token': context.testGlobals.hospitalUser.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          name: ['Medical center name must be at least 3 characters'],
        },
      },
    },
  },
  {
    title: 'should fail if new country value is not a string',
    request: context => ({
      body: { ...updateUserFields, location: { ...updateUserFields, country: 45 } },
      headers: {
        'req-token': context.testGlobals.hospitalUser.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          'location.country': ['Country field is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if new state value is not a string',
    request: context => ({
      body: { ...updateUserFields, location: { ...updateUserFields, state: 45 } },
      headers: {
        'req-token': context.testGlobals.hospitalUser.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          'location.state': ['State field is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if new address value is not a string',
    request: context => ({
      body: { ...updateUserFields, location: { ...updateUserFields, address: 45 } },
      headers: {
        'req-token': context.testGlobals.hospitalUser.authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          'location.address': ['Address field is a required string'],
        },
      },
    },
  },
];

const testTable = testCases.map(testCase => [testCase.title, testCase.request, testCase.response]);

test.each(testTable)('Update Hospital User endpoint: %s', (title, reqData, resData) => {
  const testGlobals = JSON.parse(process.env.TEST_GLOBALS);
  const hospitalUserEndpoint = `/api/hospital/${testGlobals.hospitalUser.id}`;
  // eslint-disable-next-line no-console
  console.log(hospitalUserEndpoint);

  const reqContext = { testGlobals };
  let processedReqData;
  if (typeof reqData === 'function') {
    processedReqData = reqData(reqContext);
  } else processedReqData = reqData;
  return request
    .put(hospitalUserEndpoint)
    .send(processedReqData.body || {})
    .set(processedReqData.headers || {})
    .then((res) => {
      expect(res.status).toBe(resData.status);
      expect(res.body).toMatchObject(resData.body);
    });
});
