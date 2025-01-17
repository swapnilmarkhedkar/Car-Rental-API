const {Booking} = require('../models/Booking');

module.exports = {
    returnDateQuery : function(carId,toDate,fromDate){
        var query = {
            carId:carId,
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
        return query;
    },

    returnCurrentDateQuery : function(carId){
        // Assuming a car is booked for atleast a day
        var currentDate = Date.now();
        var query = {
            carId:carId,
            pickupDate:{
                $lte: currentDate
            },
            dropDate: {
                $gte: currentDate
            }
        };
        return query;
    },

    isCurrentCarBooked: function(query){
        return new Promise((resolve, reject)=>{
            Booking.find(query, function (err, bookings){
                if(err) reject(err); // Handle error
                
                if (bookings.length == 0){
                    // Promise will resolve if currently not booked
                    resolve();
                }
                else{
                    // Promise will reject if currently booked
                    reject();
                }
            });
        });
    }
}