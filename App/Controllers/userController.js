const commonController = require('../Controllers/commonController');
const responseController = require('../Middleware/response');
let userController = {};


userController.cab_booking = async (req, res) => {
    try {
        let commonCheck = commonController.validateReqBody(req.body, ['driver_name', 'is_booked', 'driver_mobile', 'cab_no', 'lattitude', 'longitude', 'colour'], 'body');
        if (commonCheck) {
            return responseController.sendDriverErrorResponse(req, res, PARAMETER_MISSING + "==>" + commonCheck);
        }
        if (!req || !req.body.lattitude || req.body.longitude || !isNaN(req.query.lattitude) || !isNaN(req.query.longitude)) {
            return responseController.sendDriverErrorResponse(req, res, ["Invalid parameter lattitude and longtiude"]);
        }
        var lattitude = parseInt(req.query.lattitude);
        var longitude = parseInt(req.query.longitude);

        let userLocation = {
            'lattitude': lattitude,
            'longitude': longitude
        }
        var color = req.body.colour || null;
        var cab = await getClosestCab(userLocation, color);
        if(!cab|| !cab.length) {
            return responseController.sendDriverErrorResponse(req, res, ['No near cab found'])
        } 
        return responseController.sendDriverSuccessResponse(req, res, ['Cab succesfully booked']);
    } catch (error) {
        console.error("UserController Cab Booking Error =========>", error);
        return responseController.sendDriverErrorResponse(req, res, error);
    }
}
module.exports = userController;

var getClosestCab = function (location, color) {
    return new Promise(async (resolve, reject) => {
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
            cab_details.array.forEach(cab => {
                if(!parseInt(cab.is_booked) == 0 && color.toUpperCase() === cab.color) {
                    var distance = await getDistance(cab_location_lattitude, location, cab_location_longitude);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closest = cab;
                    }
                }
            });
            return resolve(closest);
        } catch (error) {
            return reject(error);
        }
    }); 
}

var getDistance = function(cab_location_lattitude, actual_location, cab_location_longitude) {
    return new Promise((resolve, reject) => {
        try {
            if(!cab_location_lattitude || !actual_location || !cab_location_longitude)  {
                return reject(['Invalid parameters to get distance']);
            }
            var cab_alttitude = cab_location_lattitude.lattitude - actual_location.lattitude;
            var cab_longitude = cab_location_longitude.longitude - actual_location.longitude;
            var  distance = Math.sqrt(cab_alttitude*cab_alttitude + cab_longitude*cab_longitude);
            return resolve(distance);
        } catch (error) {
           return reject(error); 
        }
    });
}