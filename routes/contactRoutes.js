const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Public route: gửi contact
router.post('/', controller.create);

// Admin routes
router.get('/', auth, role(['Admin']), controller.getAll);
router.get('/:id', auth, role(['Admin']), controller.getById);
router.put('/:id', auth, role(['Admin']), controller.update);
router.delete('/:id', auth, role(['Admin']), controller.delete);

module.exports = router;