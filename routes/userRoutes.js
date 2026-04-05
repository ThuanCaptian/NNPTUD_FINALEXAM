const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/', auth, role(['Admin']), controller.getAll);
router.put('/:id', auth, role(['Admin']), controller.updateUser);

module.exports = router;