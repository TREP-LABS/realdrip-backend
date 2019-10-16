import express from 'express';
import controllers from './controllers';
import db from '../db';
import authMiddleware from './middlewares/authMiddleware';
import userStatus from './middlewares/userStatus';

const router = express.Router();
const { hasConfirmedEmail, hasVerifiedAccount, hasUserPrivledge } = userStatus;
const { HOSPITAL_ADMIN_USER, WARD_USER } = db.users.userTypes;

router.get('/health', (req, res) => res.json({ status: 'I am alive' }));

router.post('/hospital', controllers.hospitalUser.createAdminUser);
router.put('/hospital', authMiddleware, controllers.hospitalUser.updateAdminUser);
router.get('/hospital/confirmEmail', controllers.hospitalUser.confirmUserAccount);

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
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
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

router.post('/users/login', controllers.allUser.login);
router.put('/users/:userId/password', authMiddleware, controllers.allUser.updatePassword);

router.get('/device', authMiddleware, controllers.device.getAllDevice);
router.get('/device/:deviceId', authMiddleware, controllers.device.getSingleDevice);
router.put('/device/:deviceId', authMiddleware, controllers.device.updateDevice);

router.post(
  '/infusion',
  authMiddleware,
  hasUserPrivledge([HOSPITAL_ADMIN_USER.toLowerCase(), WARD_USER.toLowerCase()]),
  controllers.infusion.createInfusion,
);
router.get('/infusion', authMiddleware, controllers.infusion.getAllInfusion);

export default router;
