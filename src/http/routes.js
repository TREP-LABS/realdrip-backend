import express from 'express';
import controllers from './controllers';

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'I am alive' }));

router.post('/users/admin', controllers.user.createAdminUser);

export default router;