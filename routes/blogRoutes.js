const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Admin/Staff routes
router.post('/', auth, role(['Admin','Staff']), upload.single('image'), controller.create);
router.put('/:id', auth, role(['Admin','Staff']), upload.single('image'), controller.update);

// Admin only
router.delete('/:id', auth, role(['Admin']), controller.delete);

module.exports = router;