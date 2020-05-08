module.exports = {
    returnDateQuery : function(car,toDate,fromDate){
        var query = {
            carId:car.id,
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
    }
}