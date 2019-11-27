import db from '../../db';
import testRunner from '../utils/testRunner';


const { HOSPITAL_ADMIN_USER } = db.users.userTypes;

const loginDetails = hospitalUser => ({
  email: hospitalUser.email,
  password: hospitalUser.stringPass,
  userType: 'hospital_admin',
});

const loginPath = '/api//users/login';

const testCases = [
  {
    title: 'should log user in succcessfully',
    request: context => ({
      method: 'post',
      path: loginPath,
      body: loginDetails(context.testGlobals[HOSPITAL_ADMIN_USER]),
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Login successfully',
        data: {
          user: {
            _id: expect.any(String),
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
      method: 'post',
      path: loginPath,
      body: { ...loginDetails(context.testGlobals[HOSPITAL_ADMIN_USER]), email: undefined },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request body',
        errors: {
          email: ['User email is a required string'],
        },
      },
    },
  },
  {
    title: 'should fail if user email is not a valid email address',
    request: context => ({
      method: 'post',
      path: loginPath,
      body: { ...loginDetails(context.testGlobals[HOSPITAL_ADMIN_USER]), email: 'testt.com' },
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
      method: 'post',
      path: loginPath,
      body: { ...loginDetails(context.testGlobals[HOSPITAL_ADMIN_USER]), email: 'randomerandomeuser@gmail.com' },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Incorrect email or password',
      },
    },
  },
  {
    title: 'should fail if user password is not provided',
    request: context => ({
      method: 'post',
      path: loginPath,
      body: { ...loginDetails(context.testGlobals[HOSPITAL_ADMIN_USER]), password: undefined },
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
      method: 'post',
      path: loginPath,
      body: { ...loginDetails(context.testGlobals[HOSPITAL_ADMIN_USER]), password: `${context.testGlobals[HOSPITAL_ADMIN_USER].stringPass}--` },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Incorrect email or password',
      },
    },
  },
  {
    title: 'should fail if user type is not valid',
    request: context => ({
      method: 'post',
      path: loginPath,
      body: { ...loginDetails(context.testGlobals[HOSPITAL_ADMIN_USER]), userType: 'random_user_type' },
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

testRunner(testCases, 'User login', {});
