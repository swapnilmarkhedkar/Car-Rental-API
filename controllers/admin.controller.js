const {Admin} = require('../models/Admin');
const _ = require('lodash');

module.exports = {
    getAllAdmins: (req,res)=>{
        Admin.find().then( (admins)=>{
            res.send({admins});
        }).catch((e)=>{
            res.status(400).send(e);
        });
    },

    postAdmin: (req,res)=>{
        var body = _.pick(req.body, ['email', 'name', 'password']);
        var admin = new Admin(body);
    
        admin.save().then(()=>{
            return admin.generateAuthToken(); // Promise is returned
        }).then((token)=>{
            res.header('x-auth',token).send(admin);
        }).catch((e)=>{
            res.status(400).send(e);
        });
    },

    loginAdmin: (req,res)=>{
        var body = _.pick(req.body, ['email', 'password']);
    
        Admin.findByCredentials(body.email, body.password).then((admin)=>{
            return admin.generateAuthToken().then((token)=>{
                res.header('x-auth',token).send(admin);
            });
        }).catch((e)=>{
            res.status(400).send(e);
        });
    },

    logoutAdmin: (req,res)=>{
        req.admin.removeToken(req.token).then(()=>{
            res.status(200).send();
        }, ()=>{
            res.status(400).send();
        });
    }
};