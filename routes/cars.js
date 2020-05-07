const express = require('express');
const router = express.Router();
const {Car} = require('../models/Car');
var {ObjectID} = require('mongodb'); // ObjectID = require('mongodb).ObjectID

// Get all cars
router.get('/', (req,res)=>{
    Car.find().then((cars)=>{
        res.send({cars}); // Kept as object instead of array for flexibilty. Thus allowing to send multiple entities in the future 
    }, (e)=>{
        res.status(400).send(e);
    });
});

// GET car by ID
router.get('/:id', (req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Car.findById(id).then( (car)=>{
        if(!car){
            return res.status(404).send();
        }
        
        res.send({car}); 
        
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// POST car
router.post('/', (req,res)=>{
    var car = new Car({
        vehicleNumber: req.body.vehicleNumber,
        modelName: req.body.modelName,
        seatingCapacity: req.body.seatingCapacity,
        rent: req.body.rent
    });

    car.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    });
});

// Update car details
router.patch('/:id', (req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    // @TODO: Use lodash to pick entities to update
    // @TODO: Change to findOneAndUpdate
    Car.findByIdAndUpdate(id, {$set: req.body}, {new:true})
    .then( (car)=>{
        if(!car){
            return res.status(404).send();
        }
        
        res.send({car}); 
        
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// DELETE car
router.delete('/:id', (req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    // @TODO: Change to findOneAndUpdate
    Car.findByIdAndDelete(id).then((car)=>{
        if(!car){
            return res.status(404).send();
        }
        
        res.send({car}); 
       
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

module.exports=router;