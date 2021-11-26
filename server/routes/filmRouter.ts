const Router = require('express');
import FilmController from '../controllers/FilmController';
import checkRoleMiddleware from '../middleware/checkRoleMiddleware';
const router = new Router();

router.post('/', checkRoleMiddleware("ADMIN"), FilmController.create);
router.put('/:id', checkRoleMiddleware("ADMIN"), FilmController.update);
router.get('/', FilmController.getAll);
router.get('/:id', FilmController.getOne);

router.post('/upcoming', checkRoleMiddleware("ADMIN"), FilmController.addUpcoming);
router.delete('/upcoming/delete', checkRoleMiddleware("ADMIN"), FilmController.deleteUpcoming);

export default router;
