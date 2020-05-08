const {Booking} = require('../models/Booking');
const {ObjectID} = require('mongodb'); // ObjectID = require('mongodb).ObjectID

module.exports = {
    getAllBookings:  (req,res)=>{
        Booking.find().then( (bookings)=>{
            res.send({bookings});
        }).catch((e)=>{
            res.status(400).send(e);
        });
    },

    postBooking: (req,res)=>{

        // @TODO: Check if customer exists
        // @TODO: Check if customer isn't booking for another customer
    
        var booking = new Booking({
            carId: req.body.carId,
            customerId: req.body.customerId,
            pickupDate: req.body.pickupDate,
            dropDate: req.body.dropDate
        });
    
        booking.save().then((doc)=>{
            res.send(doc);
        }).catch((e)=>{
            res.status(400).send(e);
        });
    },

    deleteBooking: (req,res)=>{
        var id = req.params.id;
    
        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }
    
        Booking.findByIdAndDelete(id).then((booking)=>{
            if(!booking){
                return res.status(404).send();
            }
            
            res.send({booking}); 
           
        }).catch((e)=>{
            res.status(400).send(e);
        });
    }
};