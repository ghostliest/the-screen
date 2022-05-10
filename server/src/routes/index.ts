import { Router } from 'express'
import filmRouter from './film.router'
import userRouter from './user.router'
import OtherController from '../controllers/Other.controller'

const router = Router()

// TODO: consider refactoring
const otherController = new OtherController()

router.use('/film', filmRouter)
router.use('/user', userRouter)

router.get('/search/:name(all|film|director|actor|country|genre)?', otherController.search)
router.get('/get-meta/:type(director|actor|country|genre)?', otherController.getMeta)
router.post('/create/:name(director|actor)?', otherController.create)

export default router
