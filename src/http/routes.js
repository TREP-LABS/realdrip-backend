import express from 'express';
import controllers from './controllers';
import db from '../db';
import authMiddleware from './middlewares/authMiddleware';
import userCheck from './middlewares/userCheck';

const router = express.Router();

const { HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER } = db.users.userTypes;

router.get('/health', async (req, res) => res.json({ status: 'I am alive' }));

router.post('/hospital', controllers.hospitalUser.createAdminUser);

router.get('/hospital/confirmEmail', controllers.hospitalUser.confirmUserAccount);

router.post('/users/login', controllers.allUser.login);

router.put('/users/:userId/password', authMiddleware, controllers.allUser.updatePassword);

router.put(
  '/hospital/:userId',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER],
  }),
  controllers.hospitalUser.updateAdminUser,
);

router.post(
  '/hospital/sendEmailValidationMail',
  authMiddleware,
  userCheck({ type: [HOSPITAL_ADMIN_USER] }),
  controllers.hospitalUser.sendEmailValidationMail,
);

router.post(
  '/ward',
  authMiddleware,
  userCheck({ confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER] }),
  controllers.wardUser.createWardUser,
);

router.get(
  '/ward/:wardId',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER],
  }),
  controllers.wardUser.getSingleWardUser,
);

router.put(
  '/ward/:wardId',
  authMiddleware,
  userCheck({ type: [WARD_USER] }),
  controllers.wardUser.updateWardUser,
);

router.get(
  '/ward',
  authMiddleware,
  userCheck({ confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER] }),
  controllers.wardUser.getAllWardUser,
);

router.post(
  '/nurse',
  authMiddleware,
  userCheck({ type: [WARD_USER] }),
  controllers.nurseUser.createNurseUser,
);

router.get(
  '/nurse/:nurseId',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.nurseUser.getSingleNurseUser,
);

router.put(
  '/nurse/:nurseId',
  authMiddleware,
  userCheck({ type: [NURSE_USER] }),
  controllers.nurseUser.updateNurseUser,
);

router.get(
  '/nurse',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER],
  }),
  controllers.nurseUser.getAllNurseUser,
);

router.get(
  '/devices',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.device.getAllDevice,
);

router.get(
  '/devices/:deviceId',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.device.getSingleDevice,
);

router.put(
  '/devices/:deviceId',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER],
  }),
  controllers.device.updateDevice,
);

router.post(
  '/infusion',
  authMiddleware,
  userCheck({ type: [NURSE_USER, WARD_USER] }),
  controllers.infusion.createInfusion,
);

router.get(
  '/infusion',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.infusion.getAllInfusion,
);

router.get(
  '/infusion/:infusionId',
  authMiddleware,
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.infusion.getSingleInfusion,
);

router.put(
  '/infusion/:infusionId',
  authMiddleware,
  userCheck({ type: [WARD_USER, NURSE_USER] }),
  controllers.infusion.updateInfusion,
);

router.delete(
  '/infusion/:infusionId',
  authMiddleware,
  userCheck({ type: [WARD_USER] }),
  controllers.infusion.deleteInfusion,
);

export default router;
