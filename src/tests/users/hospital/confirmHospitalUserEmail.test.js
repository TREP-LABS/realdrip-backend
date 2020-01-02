import jwt from 'jsonwebtoken';
import db from '../../../db';
import testRunner from '../../utils/testRunner';

const { HOSPITAL_ADMIN_USER } = db.users.userTypes;
const jwtSecrete = process.env.JWT_SECRETE;
const validToken = jwt.sign({ email: 'hospitaluser@test.com', userType: HOSPITAL_ADMIN_USER }, jwtSecrete);

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
      path: '/api/hospital/confirmEmail?',
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          regToken: ['"regToken" is a required query parameter'],
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
