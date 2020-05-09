const {Booking} = require('../models/Booking');
const utils = require('../utils/util');

// Middleware to check if booking exists for a particular car that day
var isCarBooked = (req,res,next)=>{
    var carId = req.params.id;
    var query = utils.returnCurrentDateQuery(carId);
    
    Booking.find(query).then((booking)=>{
        if(booking.length == 0){
            // Car not booked
            next();
        }

        else{
            // booked
            return Promise.reject('Car booked right now');
        }
    }).catch((e)=>{
        console.log('Here');
        res.status(400).send(e);
    });
};

// Middleware to check if return date is before pickup date
var isValidDate = (req,res,next)=>{
    var fromDate = req.body.pickupDate;
    var toDate = req.body.dropDate;

    // @TODO: Change to Promise
    if(fromDate>toDate) 
        res.status(400).send('Cannot drop car before picking it up');
    else
        next();
};

// Middleware to check if booking exists
var isBooked = (req,res,next)=>{
    var fromDate = req.body.pickupDate;
    var toDate = req.body.dropDate;
    var carId = req.body.carId;
    var query = utils.returnDateQuery(carId,toDate,fromDate);
    
    Booking.find(query).then((booking)=>{
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

module.exports = {
    isCarBooked,
    isValidDate,
    isBooked
}