import db from '../../../db';
import testRunner from '../../utils/testRunner';

const { HOSPITAL_ADMIN_USER } = db.users.userTypes;

const userDetails = {
  name: 'Test User',
  email: 'test@test.com',
  password: 'Password1',
  confirmPassword: 'Password1',
  location: {
    country: 'TestCountry',
    state: 'TestState',
    address: 'TestAddress',
  },
};

const createHospitalUserPath = '/api/hospital';

const testCases = [
  {
    title: 'should create hospital user',
    request: {
      body: userDetails,
      method: 'post',
      path: createHospitalUserPath,
    },
    response: {
      status: 201,
      body: {
        success: true,
        message: 'Admin user created successfully',
        data: {
          _id: expect.any(String),
          name: userDetails.name,
          email: userDetails.email,
          location: userDetails.location,
          confirmedEmail: false,
          verifiedPurchase: false,
        },
      },
    },
  },
  {
    title: 'should fail if user with the same email already exist',
    request: context => ({
      method: 'post',
      path: createHospitalUserPath,
      body: {
        ...userDetails,
        email: context.testGlobals[HOSPITAL_ADMIN_USER].email,
      },
    }),
    response: {
      status: 409,
      body: {
        success: false,
        message: 'User with this email already exist',
      },
    },
  },
  {
    title: 'should fail if user name is not in request body',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, name: undefined },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          name: ['"name" is required'],
        },
      },
    },
  },
  {
    title: 'should fail if user name is less than 3 chars',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, name: 'me' },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          name: ['"name" length must be at least 3 characters long'],
        },
      },
    },
  },
  {
    title: 'should fail if user email is not in request body',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, email: undefined },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          email: ['"email" is required'],
        },
      },
    },
  },
  {
    title: 'should fail if user email is not a valid email address',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, email: 'testtt.com' },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          email: ['"email" must be a valid email'],
        },
      },
    },
  },
  {
    title: 'should fail if user password is not in request body',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, password: undefined },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          password: ['"password" is required'],
        },
      },
    },
  },
  {
    // A weak password is a password that is less than 7 characters
    // and is not a mix of capital, small letters and numbers.
    title: 'should fail if password is weak',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, password: 'password' },
    },
    response: () => ({
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          password: ['"password" must be at least 7 character mix of capital, small letters with numbers'],
        },
      },
    }),
  },
  {
    title: 'should fail if confirmPassword value is not in request body',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, confirmPassword: undefined },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          confirmPassword: ['"confirmPassword" is required'],
        },
      },
    },
  },
  {
    title: 'should fail if confirm password value does not match password value',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, confirmPassword: `${userDetails.password}ttt` },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          confirmPassword: ['"confirmPassword" must match the password value'],
        },
      },
    },
  },
  {
    title: 'should fail if country value is not in request body',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, location: { ...userDetails.location, country: undefined } },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          'location.country': ['"location.country" is required'],
        },
      },
    },
  },
  {
    title: 'should fail if state value is not in request body',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, location: { ...userDetails.location, state: undefined } },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          'location.state': ['"location.state" is required'],
        },
      },
    },
  },
  {
    title: 'should fail if address value is not in request body',
    request: {
      method: 'post',
      path: createHospitalUserPath,
      body: { ...userDetails, location: { ...userDetails.location, address: undefined } },
    },
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Invalid request data',
        errors: {
          'location.address': ['"location.address" is required'],
        },
      },
    },
  },
];


testRunner(testCases, 'Create hospital user', {});
