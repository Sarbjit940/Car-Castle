const express = require('express');
const app = express();
const router = express.Router();

//Require Controllers
const authController =  require('../Middleware/auth')
const userController = require('../Controllers/userController');


router.post('/book', authController.apiAuth, userController.cab_booking);

module.exports = router;