const express = require('express');
const router = express.Router();
const utils = require('../utils/util');

const {Car} = require('../models/Car');
const {Booking} = require('../models/Booking');
const {ObjectID} = require('mongodb'); // ObjectID = require('mongodb).ObjectID

// GET all cars
router.get('/', (req,res)=>{
    Car.find().then((cars)=>{
        res.send({cars}); // Kept as object instead of array for flexibilty. Thus allowing to send multiple entities in the future 
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// GET cars by date and check if they are booked
router.get('/date/:pickupDate/:dropDate', (req,res)=>{
    var fromDate = req.params.pickupDate;
    var toDate = req.params.dropDate;
    // @TODO: Validate dates

    carList = [];
    Car.find(req.query).then((cars)=>{
        // req.query is used to add additional query parameter like ?seatingCapacity=5&rent=1000

        // Look through all cars and check if booked for that period
        for(var i=0; i<cars.length; i++){
            let car=cars[i];
            // Check if that car is available in specified date range
          
            var query = utils.returnDateQuery(car.id,toDate,fromDate);

            // Promise adds to list if condition is satisfied
            carList.push(new Promise (function(resolve, reject){
                Booking.find(query, function(err,bookings){
                    if(err) reject(err); // Handle error

                    if (bookings.length == 0){
                        resolve(car);
                    }
                    else{
                        resolve();
                    }
                });
            }));
        }

        // Waits till all requests are satisfied
        Promise.all(carList).then(function(results){
            finalList= [];

            // Add to list non-null elements
            for(var i=0; i<results.length; i++){
                if(results[i])
                    finalList.push(results[i]);
            }
            res.send(finalList);

        }).catch((e)=>{
            res.status(400).send(e);
        });
    }).catch((e)=>{
        res.status(400).send(e);
    });

    // Alternative
    // Use Car.populate('bookings'), however this would require a bookings array associated with each car
});

// GET cars by date and check if they are booked
router.get('/newdate/:pickupDate/:dropDate', (req,res)=>{
    var fromDate = req.params.pickupDate;
    var toDate = req.params.dropDate;
    // @TODO: Validate dates

    carList = [];
    Car.find(req.query).then((cars)=>{
        // req.query is used to add additional query parameter like ?seatingCapacity=5&rent=1000

        // Look through all cars and check if booked for that period
        for(var i=0; i<cars.length; i++){
            let car=cars[i];
            // Check if that car is available in specified date range
          
            var query = utils.returnDateQuery(car.id,toDate,fromDate);
            // Promise adds to list if condition is satisfied
            carList.push(new Promise (function(resolve, reject){
                isCurrCarBooked(query).then(()=>{
                    // Promise resolved which means currently not booked
                    resolve(car);             
                }).catch(()=>{
                    // Promise rejected and thus booked
                    resolve();
                });
            }));
        }

        // Waits till all requests are satisfied
        Promise.all(carList).then(function(results){
            finalList= [];

            // Add to list non-null elements
            for(var i=0; i<results.length; i++){
                if(results[i])
                    finalList.push(results[i]);
            }
            res.send(finalList);

        }).catch((e)=>{
            res.status(400).send(e);
        });
    }).catch((e)=>{
        res.status(400).send(e);
    });

    // Alternative
    // Use Car.populate('bookings'), however this would require a bookings array associated with each car
});

function isCurrCarBooked(query){
    return new Promise((resolve, reject)=>{
        Booking.find(query, function (err, bookings){
            if(err) reject(err); // Handle error

            if (bookings.length == 0){
                // Promise will resolve if currently not booked
                resolve();
            }
            else{
                // Promise will reject if currently booked
                resolve();
            }
        });
    });
};

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
        
        var query = utils.returnCurrentDateQuery(car.id);
        isCurrCarBooked(query).then(()=>{
            // Promise resolved which means currently not booked
            res.send({
                car,
                isBooked:false
            });             
        }).catch(()=>{
            // Promise rejected and thus booked
            res.send({
                car,
                isBooked:true
            })
        });
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

// Middleware to check if booking exists for a particular car that day
var isCarBooked = (req,res,next)=>{
    var carId = req.params.id;
    var query = utils.returnCurrentDateQuery(carId);
    
    Booking.find(query).then((booking)=>{
        if(booking.length == 0){
            // Car not booked
            next();
        }

        else{
            // booked
            return Promise.reject('Car booked right now');
        }
    }).catch((e)=>{
        console.log('Here');
        res.status(400).send(e);
    });
};

// Update car details
router.patch('/:id', isCarBooked, (req,res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    // Check if Car is booked currently
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
router.delete('/:id', isCarBooked, (req,res)=>{
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