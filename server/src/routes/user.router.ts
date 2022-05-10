import { Router } from 'express'
import UserController from '../controllers/User.controller'
import UserService from '../services/User.service'
import authMiddleware from '../middleware/auth.middleware'
import FoldersService from '../services/Folders.service'
import RatingService from '../services/Rating.service'
import filmRouter from './folders.router'

const router = Router()

const userController = new UserController(
	new UserService(),
	new FoldersService(),
	new RatingService()
)

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.put('/update', authMiddleware, userController.update)
router.delete('/delete', authMiddleware, userController.delete)

router.post('/rate', authMiddleware, userController.addRate)
router.get('/rate', authMiddleware, userController.checkRate)

router.use('/folder', authMiddleware, filmRouter)

export default router
