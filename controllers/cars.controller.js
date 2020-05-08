const {Car} = require('../models/Car');

module.exports = {
    getAllCars: (req,res)=>{
        Car.find().then((cars)=>{
            res.send({cars}); // Kept as object instead of array for flexibilty. Thus allowing to send multiple entities in the future 
        }).catch((e)=>{
            res.status(400).send(e);
        });
    }
};