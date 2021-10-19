const Router = require('express');
import FilmController from '../controllers/FilmController';
const router = new Router();

const filmController = new FilmController();

router.post('/', filmController.create);

export default router;
