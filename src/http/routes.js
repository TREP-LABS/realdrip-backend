import express from 'express';
import controllers from './controllers';
import Auth from './middleware/Auth';

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'I am alive' }));

router.post('/hospital', controllers.user.createAdminUser);
router.get('/hospital/confirmEmail', controllers.user.confirmUserAccount);
router.post('/users/login', controllers.user.login);
router.get('/device/:deviceId', Auth, controllers.device.getSingleDevice);

export default router;
