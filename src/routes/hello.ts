import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello, Express using TypeScript!' });
});

export default router;
