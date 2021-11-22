const Router = require('express');
const router = new Router();
import filmRouter from './filmRouter'
import userRouter from './userRouter'
import BaseController from '../controllers/BaseController';
const baseController = new BaseController();

router.use('/film', filmRouter);
router.use('/user', userRouter);
router.get('/search/:name(director|actor|country|genre)?', baseController.search);
router.post('/create/:name(director|actor)?', baseController.create);

export default router;
