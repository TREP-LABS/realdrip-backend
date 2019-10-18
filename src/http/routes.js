import express from 'express';
import controllers from './controllers';
import authMiddleware from './middlewares/authMiddleware';
import userStatus from './middlewares/userStatus';

const router = express.Router();
const { isHospitalUser, hasConfirmedEmail, hasVerifiedAccount } = userStatus;

router.get('/health', (req, res) => res.json({ status: 'I am alive' }));

router.post('/hospital', controllers.hospitalUser.createAdminUser);
router.put('/hospital', authMiddleware, controllers.hospitalUser.updateAdminUser);
router.get('/hospital/confirmEmail', controllers.hospitalUser.confirmUserAccount);

router.post(
  '/ward',
  authMiddleware,
  isHospitalUser,
  hasConfirmedEmail,
  hasVerifiedAccount,
  controllers.wardUser.createWardUser,
);

router.post('/users/login', controllers.allUser.login);

router.get('/device', authMiddleware, controllers.device.getAllDevice);
router.get('/device/:deviceId', authMiddleware, controllers.device.getSingleDevice);
router.put('/device/:deviceId', authMiddleware, controllers.device.updateDevice);

router.post('/infusion', authMiddleware, controllers.infusion.createInfusion);
router.get('/infusion', authMiddleware, controllers.infusion.getAllInfusion);
router.get('/infusion/:infusionId', authMiddleware, controllers.infusion.getSingleInfusion);
router.put('/infusion/:infusionId', authMiddleware, controllers.infusion.updateInfusion);

export default router;
