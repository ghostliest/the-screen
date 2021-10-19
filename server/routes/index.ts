const Router = require('express');
const router = new Router();
import filmRouter from './filmRouter'

router.use('/film', filmRouter)

export default router;
