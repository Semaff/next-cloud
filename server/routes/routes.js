const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const fileRouter = require('./fileRouter');
const folderRouter = require('./folderRouter');

router.use('/user', userRouter);
router.use('/file', fileRouter);
router.use('/folder', folderRouter);

module.exports = router;