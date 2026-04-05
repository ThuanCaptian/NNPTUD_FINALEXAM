const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderDetailController');
const auth = require('../middleware/authMiddleware');

// GET ALL
router.get('/', auth, controller.getAll);

// GET BY ID
router.get('/:id', auth, controller.getById);

// CREATE
router.post('/', auth, controller.create);

// UPDATE
router.put('/:id', auth, controller.update);

// DELETE
router.delete('/:id', auth, controller.delete);

module.exports = router;