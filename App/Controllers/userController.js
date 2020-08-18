const commonController = require('../Controllers/commonController');
const responseController = require('../Middleware/response');
let userController = {};


userController.cab_booking = async (req, res) => {
    try {
        let commonCheck = commonController.validateReqBody(req, ['user_name', 'is_booked', 'lattitude', 'longitude', 'colour'], 'body');
        if (commonCheck) {
            return responseController.sendDriverErrorResponse(req, res, PARAMETER_MISSING + " ===> " + commonCheck);
        }
        if (isNaN(req.body.lattitude) || isNaN(req.body.longitude)) {
            return responseController.sendDriverErrorResponse(req, res, ["Invalid parameter lattitude and longtiude"]);
        }
        var lattitude = parseInt(req.body.lattitude);
        var longitude = parseInt(req.body.longitude);

        let userLocation = {
            'lattitude': lattitude,
            'longitude': longitude
        }
        var color = req.body.colour || null;
        var cab = await getClosestCab(userLocation, color);
        if(!cab) {
            return responseController.sendDriverErrorResponse(req, res, ['No near cab found'])
        } 
        let driverDetails = await commonController.findInDb({"cab_no": cab.distance.cab_no}, 'Driver_details', ['driver_name, driver_mobile']);
        driverDetails = driverDetails[0];
        insertObj = {
            "user_name": req.body.user_name,
            "driver_name": driverDetails['driver_name'],
            "is_booked" : 1,
            "cab_no": cab.distance.cab_no
        }
        await commonController.insertInDB(insertObj, 'users');
        cab.distance['driver_name'] = driverDetails['driver_name'];
        cab.distance['driver_mobile'] = driverDetails['driver_mobile'];
        cab.distance['colour'] =   req.body.colour;
        cab.distance['is_booked'] =   1;

        return responseController.sendDriverSuccessResponse(req, res, ['Cab succesfully booked'], cab.distance);
    } catch (error) {
        console.error("UserController Cab Booking Error =========>", error);
        return responseController.sendDriverErrorResponse(req, res, error);
    }
}

module.exports = userController;

var getClosestCab = function (location, color) {
    return new Promise( async (resolve, reject) => {
        try {
            if(!location) {
               return reject(["Cab Location Not Found"]);
            } 
            var closest = null;
            var closestDistance = Infinity;
            let cab_details = await commonController.findInDb({'is_booked': 0}, 'cabs', ['*']);
            if(!cab_details) {
                return reject(["No data found"]);
            }
           await cab_details.forEach(async cab => {
                if(parseInt(cab.is_booked) == 0) {
                    var distance = await getDistance(cab.cab_location_lattitude, location, cab.cab_location_longitude);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closest = cab;   
                    }
                }
            });
            return resolve({'distance': closest});
        } catch (error) {
            return reject(error);
        }
    }); 
}

 var  getDistance =  function (cab_location_lattitude, actual_location, cab_location_longitude) {
    return new Promise( (resolve, reject) => {
        try {
            if(!cab_location_lattitude || !actual_location || !cab_location_longitude)  {
                return reject(['Invalid parameters to get distance']);
            }
            var cab_alttitude = cab_location_lattitude - actual_location.lattitude;
            var cab_longitude = cab_location_longitude - actual_location.longitude;
            var  distance = Math.sqrt(cab_alttitude*cab_alttitude + cab_longitude*cab_longitude);
            return resolve(distance);
        } catch (error) {
           return reject(error); 
        }
    });
}