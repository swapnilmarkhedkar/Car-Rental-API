const express = require('express');
const router = express.Router();
const middleware = require('../middleware/booking.middleware');
const bookingController = require('../controllers/bookings.controller');

// GET all bookings
router.get('/', bookingController.getAllBookings);

// POST booking
router.post('/', middleware.isValidDate, middleware.isBooked, bookingController.postBooking);

// DELETE booking
router.delete('/:id', bookingController.deleteBooking);

module.exports=router;