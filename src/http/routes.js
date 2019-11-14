import express from 'express';
import controllers from './controllers';
import db from '../db';
import authMiddleware from './middlewares/authMiddleware';
import userStatus from './middlewares/userStatus';


const router = express.Router();
const { hasConfirmedEmail, hasVerifiedAccount, hasUserPrivledge } = userStatus;
const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

router.get('/health', async (req, res) => res.json({ status: 'I am alive' }));

router.post('/hospital', controllers.hospitalUser.createAdminUser);
router.put(
  '/hospital/:userId',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase()]),
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.hospitalUser.updateAdminUser,
);
router.get('/hospital/confirmEmail', controllers.hospitalUser.confirmUserAccount);

router.post(
  '/hospital/sendEmailValidationMail',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase()]),
  controllers.hospitalUser.sendEmailValidationMail,
);

router.post(
  '/ward',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase()]),
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.wardUser.createWardUser,
);
router.get(
  '/ward/:wardId',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.wardUser.getSingleWardUser,
);
router.put(
  '/ward/:wardId',
  authMiddleware,
  hasUserPrivledge([WARD_USER.toLowerCase()]),
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.wardUser.updateWardUser,
);
router.get(
  '/ward',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase()]),
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.wardUser.getAllWardUser,
);

router.post(
  '/nurse',
  authMiddleware,
  hasUserPrivledge([WARD_USER.toLowerCase()]),
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.nurseUser.createNurseUser,
);
router.get(
  '/nurse/:nurseId',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.nurseUser.getSingleNurseUser,
);
router.put(
  '/nurse/:nurseId',
  authMiddleware,
  hasUserPrivledge([NURSE_USER.toLowerCase()]),
  controllers.nurseUser.updateNurseUser,
);
router.get(
  '/nurse',
  authMiddleware,
  hasConfirmedEmail,
  hasVerifiedAccount,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  controllers.nurseUser.getAllNurseUser,
);

router.post('/users/login', controllers.allUser.login);
router.put('/users/:userId/password', authMiddleware, controllers.allUser.updatePassword);

router.get(
  '/devices',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  controllers.device.getAllDevice,
);
router.get('/devices/:deviceId', authMiddleware, controllers.device.getSingleDevice);
router.put('/devices/:deviceId',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  controllers.device.updateDevice);

router.post(
  '/infusion',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  controllers.infusion.createInfusion,
);
router.get('/infusion', authMiddleware, controllers.infusion.getAllInfusion);
router.get('/infusion/:infusionId',
  authMiddleware,
  controllers.infusion.getSingleInfusion);
router.put(
  '/infusion/:infusionId',
  authMiddleware,
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.infusion.updateInfusion,
);
router.delete(
  '/infusion/:infusionId',
  authMiddleware,
  hasConfirmedEmail,
  hasVerifiedAccount,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  controllers.infusion.deleteInfusion,
);

export default router;
