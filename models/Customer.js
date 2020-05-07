var mongoose = require('mongoose');

var Customer = mongoose.model('Customer', {
    email:{
        type: String,
        required: true,
        trim: true,
        unique:true
        // TODO: Add Validation
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
