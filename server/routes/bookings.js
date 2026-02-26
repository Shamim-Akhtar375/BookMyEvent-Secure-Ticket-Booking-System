const express = require('express');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookings');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.put('/cancel/:id', protect, cancelBooking);

module.exports = router;
