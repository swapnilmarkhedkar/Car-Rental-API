const express = require('express');
const router = express.Router();
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

// Middleware to check if return date is before pickup date
var isValidDate = (req,res,next)=>{
    var fromDate = req.body.pickupDate;
    var toDate = req.body.dropDate;

    // @TODO: Change to Promise
    if(fromDate>toDate) 
        res.status(400).send('Cannot return car before picking it up');
    else
        next();
};

// Middleware to check if booking exists
var isBooked = (req,res,next)=>{
    var fromDate = req.body.pickupDate;
    var toDate = req.body.dropDate;
    var carId = req.body.carId;

    Booking.find({
        carId: carId,
        $or:[ 
            {
                pickupDate:{
                    $lte: toDate,
                    $gte: fromDate
                }
            },
            {
                dropDate:{
                    $lte: toDate,
                    $gte: fromDate
                }
            },
            {
                pickupDate:{
                    $lte:fromDate
                },
                dropDate:{
                    $gte:toDate
                }
            }
        ]
    }).then((booking)=>{
        if(booking.length == 0){
            // Car not booked
            next();
        }

        else{
            // booked
            return Promise.reject('Car booked for that period');
        }
    }).catch((e)=>{
        console.log('Here');
        res.status(400).send(e);
    });
};

// POST booking
router.post('/', isValidDate, isBooked, (req,res)=>{

    // Check if customer exists
    // Check if customer isn't booking for another customer

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