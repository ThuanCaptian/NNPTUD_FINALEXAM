const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/', auth, role(['Admin']), controller.getAll);
router.post('/', auth, controller.create);

module.exports = router;