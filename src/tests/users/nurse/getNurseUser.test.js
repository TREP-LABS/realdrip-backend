import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const { HOSPITAL_ADMIN_USER, NURSE_USER } = db.users.userTypes;

const testCases = [
  confirmAccessLevelRestriction({
    title: 'Nurse user should not be able to get all nurses',
    userType: NURSE_USER,
    path: '/api/nurse',
    method: 'get',
  }),
  confirmAuthRestriction({
    title: 'getting all nurse users should fail if user does not send a valid auth token',
    path: '/api/nurse',
    method: 'get',
  }),
  confirmAuthRestriction({
    title: 'getting a single nurse user should fail if user does not send a valid auth token',
    path: '/api/nurse/5099803df3f4948bd2f98391', // The ID here does not have to be correct
    method: 'get',
  }),
  {
    title: 'should get all nurse users',
    request: context => ({
      body: {},
      path: '/api/nurse',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: context => ({
      status: 200,
      body: {
        success: true,
        message: 'Nurse users fetched successfully',
        data: expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              _id: context.testGlobals[NURSE_USER].id,
              name: context.testGlobals[NURSE_USER].name,
              email: context.testGlobals[NURSE_USER].email,
              phoneNo: context.testGlobals[NURSE_USER].phoneNo,
              wardId: context.testGlobals[NURSE_USER].wardId,
              hospitalId: context.testGlobals[NURSE_USER].hospitalId,
              defaultPass: context.testGlobals[NURSE_USER].defaultPass,
            }),
          ]),
        }),
      },
    }),
  },
  {
    title: 'should get a single nurse user',
    request: context => ({
      body: {},
      path: `/api/nurse/${context.testGlobals[NURSE_USER].id}`,
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
          _id: context.testGlobals[NURSE_USER].id,
          name: context.testGlobals[NURSE_USER].name,
          email: context.testGlobals[NURSE_USER].email,
          phoneNo: context.testGlobals[NURSE_USER].phoneNo,
          wardId: context.testGlobals[NURSE_USER].wardId,
          hospitalId: context.testGlobals[NURSE_USER].hospitalId,
          defaultPass: context.testGlobals[NURSE_USER].defaultPass,
        },
      },
    }),
  },
  {
    title: 'should fail if nurse id is not valid',
    request: context => ({
      body: {},
      path: '/api/nurse/555aa',
      method: 'get',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 400,
      body: {
        success: false,
        message: 'nurse id is not valid',
      },
    },
  },
];

testRunner(testCases, 'Get nurse user', {});
