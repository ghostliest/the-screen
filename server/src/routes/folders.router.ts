import { Router } from 'express'
import FoldersController from '../controllers/Folders.controller'
import FilmService from '../services/Film.service'
import FoldersService from '../services/Folders.service'
import RatingService from '../services/Rating.service'

const router = Router()

const foldersController = new FoldersController(
	new FilmService(),
	new FoldersService(),
	new RatingService()
)

router.post('/:name(watchLater|favorite|viewed)?', foldersController.addToFolder)
router.get('/:name(watchLater|favorite|viewed)?', foldersController.getFolder)
router.get('/check:name(watchLater|favorite|viewed)?:filmId?', foldersController.checkItemInFolder)

export default router
