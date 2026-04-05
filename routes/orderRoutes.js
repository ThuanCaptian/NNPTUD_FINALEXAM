const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/', auth, role(['Admin','Staff']), controller.getAll);
router.get('/:id', auth, controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, role(['Admin','Staff']), controller.update);
router.delete('/:id', auth, role(['Admin']), controller.delete);

module.exports = router;