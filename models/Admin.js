const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var AdminSchema = new mongoose.Schema({
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
        minlength: 6,
        required: true
        // TODO: Add required
    },
    tokens: [{
        access : {
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
});

AdminSchema.methods.toJSON = function(){
    var admin = this;
    var adminObject = admin.toObject();

    return _.pick(adminObject, ['_id', 'email']);
};

AdminSchema.methods.generateAuthToken = function(){
    // Didnt use arrow function since it does not bind 'this'
    var admin = this;
    var access = 'auth';

    var token = jwt.sign({
        _id: admin._id.toHexString(), // Generating token based on ID of admin
        access
    }, 'secret123').toString();

    admin.tokens = admin.tokens.concat([{access, token}]);

    return admin.save().then(()=>{
        return token;
    })
};

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = {Admin};
