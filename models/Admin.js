const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// methods for instance
AdminSchema.methods.toJSON = function(){
    // Function to only pick id and email to respond with
    var admin = this;
    var adminObject = admin.toObject();

    return _.pick(adminObject, ['_id', 'email']);
};

AdminSchema.methods.generateAuthToken = function(){
    // Didnt use arrow function since it does not bind 'this'
    // Function to generate jwt token
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

// statics for Models
AdminSchema.statics.findByToken = function(token){
    // Function to find admin by token
    var Admin = this;
    var decoded;

    try{
        decoded=jwt.verify(token, 'secret123');
    }catch(e){
        return Promise.reject();
    }

    return Admin.findOne({
        _id: decoded._id,
        'tokens.token': token, //in quotes to access the value
        'tokens.access': 'auth'
    });
};

AdminSchema.statics.findByCredentials = function(email, password){
    var Admin = this;

    return Admin.findOne({email}).then((admin)=>{
        if(!admin){
            return Promise.reject();
        }

        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err,res)=>{
                if(res){
                    resolve(admin);
                }else{
                    reject();
                }
            });
        });
    });
};

AdminSchema.pre('save', function(next){
    // This function is called before .save() is fired
    var admin = this;

    if(admin.isModified('password')){
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(admin.password, salt, (err,hash)=>{
                admin.password = hash;
                next();
            });
        });
    }else{
        // if password is hashed and salted once then go ahead
        next();
    }
});

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = {Admin};
