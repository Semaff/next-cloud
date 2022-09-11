import Router from 'express';
import userRouter from './userRouter';
import fileRouter from './fileRouter';

const router = Router();

router.use('/user', userRouter);
router.use('/files', fileRouter);

export default router;