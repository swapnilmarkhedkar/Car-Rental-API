const express = require('express');
const router = express.Router();
const middlewareBooking = require('../middleware/booking.middleware');
const middlewareAdmin = require('../middleware/admin.middleware');
const carController = require('../controllers/cars.controller');

// GET all cars
router.get('/', carController.getAllCars);

// GET car by ID
router.get('/:id', carController.getCarById);

// GET cars by date and check if they are booked
router.get('/date/:pickupDate/:dropDate', carController.getCarByDate);

// POST car
router.post('/', middlewareAdmin.authenticate ,carController.postCar);

// Update car details
router.patch('/:id', middlewareAdmin.authenticate, middlewareBooking.isCarBooked, carController.updateCar);

// DELETE car
router.delete('/:id', middlewareAdmin.authenticate, middlewareBooking.isCarBooked, carController.deleteCar);

module.exports=router;