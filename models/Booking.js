var mongoose = require('mongoose');

var Booking = mongoose.model('Booking', {
    carId : {
        type: mongoose.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    pickupDate:{
        type: Date,
        required: true
    },
    dropDate:{
        type: Date,
        required: true
    }
});

module.exports = {Booking};
