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

const authRouter = express.Router();
authRouter.use(authMiddleware);

authRouter.put('/users/:userId/password', controllers.allUser.updatePassword);

authRouter.put(
  '/hospital/:userId',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER],
  }),
  controllers.hospitalUser.updateAdminUser,
);

authRouter.post(
  '/hospital/sendEmailValidationMail',
  userCheck({ type: [HOSPITAL_ADMIN_USER] }),
  controllers.hospitalUser.sendEmailValidationMail,
);

authRouter.post(
  '/ward',
  authMiddleware,
  userCheck({ confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER] }),
  controllers.wardUser.createWardUser,
);

authRouter.get(
  '/ward/:wardId',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER],
  }),
  controllers.wardUser.getSingleWardUser,
);

authRouter.put(
  '/ward/:wardId',
  userCheck({ type: [WARD_USER] }),
  controllers.wardUser.updateWardUser,
);

authRouter.get(
  '/ward',
  userCheck({ confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER] }),
  controllers.wardUser.getAllWardUser,
);

authRouter.post(
  '/nurse',
  userCheck({ type: [WARD_USER] }),
  controllers.nurseUser.createNurseUser,
);

authRouter.get(
  '/nurse/:nurseId',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.nurseUser.getSingleNurseUser,
);

authRouter.put(
  '/nurse/:nurseId',
  userCheck({ type: [NURSE_USER] }),
  controllers.nurseUser.updateNurseUser,
);

authRouter.get(
  '/nurse',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER],
  }),
  controllers.nurseUser.getAllNurseUser,
);

authRouter.get(
  '/devices',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.device.getAllDevice,
);

authRouter.get(
  '/devices/:deviceId',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.device.getSingleDevice,
);

authRouter.put(
  '/devices/:deviceId',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER],
  }),
  controllers.device.updateDevice,
);

authRouter.post(
  '/infusion',
  userCheck({ type: [NURSE_USER, WARD_USER] }),
  controllers.infusion.createInfusion,
);

authRouter.get(
  '/infusion',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.infusion.getAllInfusion,
);

authRouter.get(
  '/infusion/:infusionId',
  userCheck({
    confirmedEmail: true, verifiedAccount: true, type: [HOSPITAL_ADMIN_USER, WARD_USER, NURSE_USER],
  }),
  controllers.infusion.getSingleInfusion,
);

authRouter.put(
  '/infusion/:infusionId',
  userCheck({ type: [WARD_USER, NURSE_USER] }),
  controllers.infusion.updateInfusion,
);

authRouter.delete(
  '/infusion/:infusionId',
  userCheck({ type: [WARD_USER] }),
  controllers.infusion.deleteInfusion,
);

router.use(authRouter);

export default router;
