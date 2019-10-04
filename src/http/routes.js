import express from 'express';
import controllers from './controllers';

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'I am alive' }));

router.post('/users/admin', controllers.user.createAdminUser);
router.get('/users/confirm', controllers.user.confirmUserAccount);
router.post('/users/login', controllers.user.login);

export default router;
