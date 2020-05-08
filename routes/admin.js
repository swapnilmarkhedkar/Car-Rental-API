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

module.exports=router;