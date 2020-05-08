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
    }
}