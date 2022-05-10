import { Router } from 'express'
import FilmController from '../controllers/Film.controller'
import FilmService from '../services/Film.service'
import checkRoleMiddleware from '../middleware/checkRole.middleware'
import RatingService from '../services/Rating.service'

const router = Router()

const filmController = new FilmController(
	new FilmService(),
	new RatingService()
)

router.post('/create', checkRoleMiddleware('ADMIN'), filmController.create)
router.put('/:id', checkRoleMiddleware('ADMIN'), filmController.update)
router.get('/get-all', filmController.getAll)
router.get('/get-all-by-ids', filmController.getAllByIds)
router.get('/:id', filmController.getOne)

export default router
