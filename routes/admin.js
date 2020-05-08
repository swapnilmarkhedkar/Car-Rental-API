const express = require('express');
const router = express.Router();
const _ = require('lodash');

const {Admin} = require('../models/Admin');

// GET all admins
router.get('/', (req,res)=>{
    Admin.find().then( (admins)=>{
        res.send({admins});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// Middleware to authenticate admin
var authenticate = (req,res,next) =>{
    var token = req.header('x-auth');

    Admin.findByToken(token).then((admin)=>{
        if(!admin){
            return Promise.reject();
        }

        req.admin = admin;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send(e);
    });
};

// GET admin
router.get('/me', authenticate, (req,res)=>{
    res.send(req.admin);
});

// POST admin
router.post('/', (req,res)=>{
    var body = _.pick(req.body, ['email', 'name', 'password']);
    var admin = new Admin(body);

    admin.save().then(()=>{
        return admin.generateAuthToken(); // Promise is returned
    }).then((token)=>{
        res.header('x-auth',token).send(admin);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// Login admin (generate auth token for login)
router.post('/login', (req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);

    Admin.findByCredential(body.email, body.password).then((admin)=>{
        res.send(admin);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

module.exports=router;