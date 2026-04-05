const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Public route
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Admin only
router.post('/', auth, role(['Admin']), controller.create);
router.put('/:id', auth, role(['Admin']), controller.update);
router.delete('/:id', auth, role(['Admin']), controller.delete);

module.exports = router;