const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

router.get('/', controller.getAll);
router.post('/', auth, controller.create);

module.exports = router;