const express = require('express');
const app = express();
const router = express.Router();

//Require Controllers
const authController =  require('../Middleware/auth')
const userController = require('../Controllers/userController');


//api's
router.post('/book', authController.apiAuth, userController.cab_booking);
router.get('/userHistory/:user_id', authController.authTokken, userController.user_history);
router.get('/completeRide/:cab_id',  authController.authTokken, userController.complete_ride);

module.exports = router;