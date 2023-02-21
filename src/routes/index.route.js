const express = require('express');
const router = express.Router();
const roomTypeRoute = require('./roomType.route');
const roomRoute = require('./room.route');
const userRoute = require('./user.route');

router.use('/rooms-types', roomTypeRoute);
router.use('/rooms', roomRoute);
router.use('/users', userRoute);

module.exports = router