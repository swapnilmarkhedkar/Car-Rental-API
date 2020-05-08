const express = require('express');
const router = express.Router();
const utils = require('../utils/util');
const middleware = require('../middleware/booking.middleware');

const {Booking} = require('../models/Booking');
var {ObjectID} = require('mongodb'); // ObjectID = require('mongodb).ObjectID

// GET all bookings
router.get('/', (req,res)=>{
    Booking.find().then( (bookings)=>{
        res.send({bookings});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// POST booking
router.post('/', middleware.isValidDate, middleware.isBooked, (req,res)=>{

    // @TODO: Check if customer exists
    // @TODO: Check if customer isn't booking for another customer

    var booking = new Booking({
        carId: req.body.carId,
        customerId: req.body.customerId,
        pickupDate: req.body.pickupDate,
        dropDate: req.body.dropDate
    });

    booking.save().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// DELETE booking
router.delete('/:id', (req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    // @TODO: Change to findOneAndUpdate
    Booking.findByIdAndDelete(id).then((booking)=>{
        if(!booking){
            return res.status(404).send();
        }
        
        res.send({booking}); 
       
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

module.exports=router;