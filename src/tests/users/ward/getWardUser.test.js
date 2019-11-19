import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

const testCases = [
  confirmAccessLevelRestriction({
    title: 'Ward user should not be able to get all wards',
    userType: WARD_USER,
    path: '/api/ward',
    method: 'get',
  }),
  confirmAccessLevelRestriction({
    title: 'Nurse user should not be able to get all wards',
    userType: NURSE_USER,
    path: '/api/ward',
    method: 'get',
  }),
  confirmAuthRestriction({
    title: 'getting all ward users should fail if user does not send a valid auth token',
    path: '/api/ward',
    method: 'get',
  }),
  confirmAuthRestriction({
    title: 'getting a single ward user should fail if user does not send a valid auth token',
    path: '/api/ward/5099803df3f4948bd2f98391', // The ID here does not have to be correct
    method: 'get',
  }),
  {
    title: 'should get all ward users',
    request: context => ({
      body: {},
      path: '/api/ward',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: context => ({
      status: 200,
      body: {
        success: true,
        message: 'Operation successful',
        data: expect.arrayContaining([
          expect.objectContaining({
            _id: context.testGlobals[WARD_USER].id,
            name: context.testGlobals[WARD_USER].name,
            email: context.testGlobals[WARD_USER].email,
            label: context.testGlobals[WARD_USER].label,
            hospitalId: context.testGlobals[WARD_USER].hospitalId,
            defaultPass: context.testGlobals[WARD_USER].defaultPass,
          }),
        ]),
      },
    }),
  },
  {
    title: 'should get a single ward user',
    request: context => ({
      body: {},
      path: `/api/ward/${context.testGlobals[WARD_USER].id}`,
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: context => ({
      status: 200,
      body: {
        success: true,
        message: 'Operation successful',
        data: {
          _id: context.testGlobals[WARD_USER].id,
          name: context.testGlobals[WARD_USER].name,
          email: context.testGlobals[WARD_USER].email,
          label: context.testGlobals[WARD_USER].label,
          hospitalId: context.testGlobals[WARD_USER].hospitalId,
          defaultPass: context.testGlobals[WARD_USER].defaultPass,
        },
      },
    }),
  },
  {
    title: 'should fail if ward id is not valid',
    request: context => ({
      body: {},
      path: '/api/ward/555aa',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'Ward id is not valid',
      },
    },
  },
];

testRunner(testCases, 'Get ward user', {});
