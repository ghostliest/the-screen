const Router = require('express');
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/authMiddleware';
const router = new Router();

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.get('/auth', authMiddleware, UserController.check);
router.put('/update', authMiddleware, UserController.update);
router.delete('/delete', authMiddleware, UserController.delete);

router.post('/rate', authMiddleware, UserController.addUserRate);
router.post('/folder/:name(watchLater|favorite|viewed)?', authMiddleware, UserController.addToFolder);
router.get('/folder/:name(watchLater|favorite|viewed)?', authMiddleware, UserController.getFolder);

export default router;
