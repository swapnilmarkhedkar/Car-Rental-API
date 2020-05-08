const mongoose = require('mongoose');
const validator = require('validator');

var Customer = mongoose.model('Customer', {
    email:{
        type: String,
        required: true,
        trim: true,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    name : {
        type: String,
        minlength: 2,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6
        // TODO: Add required
    }
});

module.exports = {Customer};
