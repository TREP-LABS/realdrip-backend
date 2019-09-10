import express from 'express';

const router = express.Router();

router.get('/version', (req, res) => res.json({ version: '1.0' }));

export default router;
