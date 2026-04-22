import { Router } from 'express';

const router = Router();
let started = false;

router.get('/startup', (_req, res) => {
  started = true;
  res.json({ status: 'ok' });
});

router.get('/live', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/ready', (_req, res) => {
  if (!started) {
    res.status(503).json({ status: 'not ready' });
    return;
  }
  res.json({ status: 'ok' });
});

export { router as healthRouter };
