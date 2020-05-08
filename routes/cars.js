const express = require('express');
const router = express.Router();
const middleware = require('../middleware/booking.middleware');
const carController = require('../controllers/cars.controller');

// GET all cars
router.get('/', carController.getAllCars);

// GET car by ID
router.get('/:id', carController.getCarById);

// GET cars by date and check if they are booked
router.get('/date/:pickupDate/:dropDate', carController.getCarByDate);

// POST car
router.post('/', carController.postCar);

// Update car details
router.patch('/:id', middleware.isCarBooked, carController.updateCar);

// DELETE car
router.delete('/:id', middleware.isCarBooked, carController.deleteCar);

module.exports=router;