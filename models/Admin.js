const mongoose = require('mongoose');
const validator = require('validator');
const adminSchemaController = require('../controllers/adminSchema.controller');

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
AdminSchema.methods.toJSON = adminSchemaController.pickIdAndEmail; //Override toJSON method

AdminSchema.methods.generateAuthToken = adminSchemaController.generateAuthToken;

AdminSchema.methods.removeToken = adminSchemaController.removeToken;

// statics for Models
AdminSchema.statics.findByToken = adminSchemaController.findByToken;

AdminSchema.statics.findByCredentials = adminSchemaController.findByCredentials;

AdminSchema.pre('save', adminSchemaController.hashPassword);

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = {Admin};
