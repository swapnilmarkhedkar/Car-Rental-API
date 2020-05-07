const express = require('express');
const router = express.Router();
const {Customer} = require('../models/Customer');
var {ObjectID} = require('mongodb'); // ObjectID = require('mongodb).ObjectID

// GET all customers
router.get('/', (req,res)=>{
    Customer.find().then( (customers)=>{
        res.send({customers});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// POST customer
router.post('/',(req,res)=>{

    var customer = new Customer({
        email: req.body.email,
        name: req.body.name
    });

    customer.save().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

module.exports=router;