import db from '../../../db';
import testRunner from '../../utils/testRunner';
import confirmAccessLevelRestriction from '../../genericTestCases/confirmAccessLevelRestriction';
import confirmAuthRestriction from '../../genericTestCases/confirmAuthRestriction';

const { WARD_USER, NURSE_USER, HOSPITAL_ADMIN_USER } = db.users.userTypes;

const testCases = [
  {
    title: 'should send email address validation mail',
    request: context => ({
      method: 'post',
      path: '/api/hospital/sendEmailValidationMail',
      headers: {
        'req-token': context.testGlobals[HOSPITAL_ADMIN_USER].authToken,
      },
    }),
    response: {
      status: 200,
      body: {
        success: true,
        message: 'Email address validation mail sent',
      },
    },
  },
  confirmAccessLevelRestriction({
    title: 'ward user should not be access this endpoint',
    userType: WARD_USER,
    path: '/api/hospital/sendEmailValidationMail',
    method: 'post',
  }),
  confirmAccessLevelRestriction({
    title: 'nurse user should not be access this endpoint',
    userType: NURSE_USER,
    path: '/api/hospital/sendEmailValidationMail',
    method: 'post',
  }),
  confirmAuthRestriction({
    title: 'should fail if user does not send a valid auth token',
    path: '/api/hospital/sendEmailValidationMail',
    method: 'post',
  }),
];

testRunner(testCases, 'Send email address validation mail', {});
