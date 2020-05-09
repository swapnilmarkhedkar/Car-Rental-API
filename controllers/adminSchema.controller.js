const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

module.exports = {
    pickIdAndEmail: function(){
        // Function to only pick id and email to respond with
        var admin = this;
        var adminObject = admin.toObject();
    
        return _.pick(adminObject, ['_id', 'email']);
    },

    generateAuthToken: function(){
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
    },

    removeToken: function(token){
        var admin = this;
    
        return admin.update({
            $pull: {
                tokens:{token}
            }
        });
    },

    findByToken: function(token){
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
    },

    findByCredentials: function(email, password){
        // Find Admin based on email and password
        var Admin = this;
    
        return Admin.findOne({email}).then((admin)=>{
            if(!admin){
                return Promise.reject();
            }
            return new Promise((resolve, reject)=>{
                bcrypt.compare(password, admin.password, (err,res)=>{
                    if(res){
                        resolve(admin);
                    }else{
                        reject();
                    }
                });
            });
        });
    },

    hashPassword:  function(next){
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
    }
};