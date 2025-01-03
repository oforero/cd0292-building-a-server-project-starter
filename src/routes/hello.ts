import { Request, Response, Router } from 'express';

const router = Router();

function defaultHandler(_: Request, res: Response): void {
  res.json({ message: 'Hello, Express using TypeScript!' });
}

router.get('/', defaultHandler);

export default router;
