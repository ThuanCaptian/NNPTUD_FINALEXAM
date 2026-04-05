const express = require('express');
const router = express.Router();
const controller = require('../controllers/bannerController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Admin routes
router.post('/', auth, role(['Admin']), upload.single('image'), controller.create);
router.put('/:id', auth, role(['Admin']), upload.single('image'), controller.update);
router.delete('/:id', auth, role(['Admin']), controller.delete);

module.exports = router;