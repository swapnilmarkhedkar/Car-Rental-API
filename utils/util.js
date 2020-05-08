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
        var currentDate = 1588928334217;
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
    }
}