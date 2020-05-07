var mongoose = require('mongoose');
// const {Car} = require('../models/Car');
// const {Customer} = require('../models/Customer');

var Booking = mongoose.model('Booking', {
    carId : {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Car'
    },
    customerId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Customer'
    },
    pickupDate:{
        type: Date,
        required: true,
        validate:{
            validator: (d)=>{
                if(d<Date.now())
                    return false;
                return true;
            },
            message: 'cannot book in the past'
        }
    },
    dropDate:{
        type: Date,
        required: true
    }
});

module.exports = {Booking};
