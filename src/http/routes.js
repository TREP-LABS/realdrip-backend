import express from 'express';
<<<<<<< HEAD
import controllers from './controllers';

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'I am alive' }));

router.post('/users/admin', controllers.user.createAdminUser);
=======
import device from './controllers/device';

const router = express.Router();

router.get('/version', (req, res) => res.json({ version: '1.0' }));
router.post('/device/verify', device.validation('verifyDevice'), device.verifyDevice);
>>>>>>> ADD device verification controller and Model

export default router;
