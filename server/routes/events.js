const express = require('express');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
