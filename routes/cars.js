const express = require('express');
const router = express.Router();
const {Car} = require('../models/Car');
const {Booking} = require('../models/Booking');
var {ObjectID} = require('mongodb'); // ObjectID = require('mongodb).ObjectID

// GET all cars
router.get('/', (req,res)=>{
    Car.find().then((cars)=>{
        res.send({cars}); // Kept as object instead of array for flexibilty. Thus allowing to send multiple entities in the future 
    }, (e)=>{
        res.status(400).send(e);
    });
});

// GET cars by date and check if they are booked
router.get('/date/:pickupDate/:dropDate', (req,res)=>{
    var fromDate = req.params.pickupDate;
    var toDate = req.params.dropDate;

    Car.find().populate('')

    // Booking.find().populate('carId')
    // .exec((err, cars)=>{
    //     if(err) throw err;
    //     console.log(cars);
    // });
    // const freeCars = await Booking.aggregate([
    //     {
    //         $lookup:
    //     }
    // ]);


    // var freeCars = [];
    // asdf

    carList = [];
    Car.find().then((cars)=>{
        // Look through all cars and check if booked for that period
        for(var i=0; i<cars.length; i++){
            let car=cars[i];
            // console.log(cars[i].id);
            // Check if that car available in speicifed date range
            query = {
                id:car.id,
                $or:[
                    {
                        pickupDate:{
                            $lte: toDate,
                            $gte: fromDate
                        }
                    },
                    {
                        dropDate:{
                            $lte: toDate,
                            $gte: fromDate
                        }
                    },
                    {
                        pickupDate:{
                            $lte:fromDate
                        },
                        dropDate:{
                            $gte:toDate
                        }
                    }
                ]
            };

            carList.push(new Promise (function(resolve, reject){
                Booking.find(query, function(err,bookings){
                    if(err) reject(err);

                    if (bookings.length == 0){
                        resolve(car);
                    }
                });
            }));
        }

        Promise.all(carList).then(function(results){
            res.send(results);
        });
    }).catch((e)=>{
        res.status(400).send(e);
    });
    //         freeCars.push(new Promise(function(resolve,reject){
    //             Booking.find(query, function(err,bookings){

    //             })
    //         }));
    //         Booking.find(
    //             query
    //         ).then((bookings)=>{
    //             // console.log(bookings);
    //             if(bookings.length==0){
    //                 // console.log('Car : ');
    //                 // console.log('i : '+ i);
    //                 // console.log(car);
    //                 freeCars.push(car);

    //                 console.log('FreeCars : '+ freeCars);

    //             }
    //         });
    //         // .catch((e)=>{
    //         //     return Promise.reject(e);
    //         // });
    //     }
    //     return freeCars;
    // }).then((freeCars)=>{
    //     console.log('FreeCars : '+ freeCars);
    //     res.send(JSON.stringify(freeCars));
    // }).
    // catch((e)=>{
    //     res.status(400).send(e);
    // });
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