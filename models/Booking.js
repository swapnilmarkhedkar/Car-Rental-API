var mongoose = require('mongoose');

var Booking = mongoose.model('Booking', {
    carId : {
        type: mongoose.ObjectId,
        required: true
    },
    customerId: {
        type: mongoose.ObjectId,
        required: true
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
