const express = require('express');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Car} = require('./models/car');

// Middleware
const app = express();
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.send('Welcome to Car Rental');
});

// @TODO: Specify a routes folder and just specify middleware here

// Get all cars
app.get('/cars', (req,res)=>{
    Car.find().then((cars)=>{
        res.send({cars}); // Kept as object instead of array for flexibilty. Thus allowing to send multiple entities in the future 
    }, (e)=>{
        res.status(400).send(e);
    });
});

app.post('/cars', (req,res)=>{
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

app.listen(PORT, console.log(`Started server on Port ${PORT} `));