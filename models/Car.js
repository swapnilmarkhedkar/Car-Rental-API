var mongoose = require('mongoose');

var Car = mongoose.model('Car', {
    vehicleNumber : {
        type: String,
        minlength: 6,
        unique:true,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    seatingCapacity:{
        type:Number,
        required: true
    },
    rent:{
        type:Number,
        required: true
    }
});

module.exports = {Car};