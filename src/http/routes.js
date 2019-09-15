import express from 'express';
import device from './controllers/device';

const router = express.Router();

router.get('/version', (req, res) => res.json({ version: '1.0' }));
router.post('/device/verify', device.validation('verifyDevice'), device.verifyDevice);

export default router;
