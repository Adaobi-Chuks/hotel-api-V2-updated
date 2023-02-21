const {addRoomType, getAllRoomTypes, getRoomTypeById, deleteRoomTypeById} = require('../controllers/roomType.controller');
const express = require('express');
const router = express.Router();
const {authenticate} = require("../middlewares/authentication.middleware");
const {authorizeAdmin} = require("../middlewares/authorization.middleware");
const {validateRoomType} = require("../middlewares/roomTypeValidation.middleware");

//create a room type
router.post("/", authenticate, authorizeAdmin, validateRoomType, addRoomType);

//Get a room types
router.get("/:id", getRoomTypeById);

//Get all room types
router.get("/", getAllRoomTypes);

//Delete a room type using Id
router.delete("/:id", authenticate, authorizeAdmin, deleteRoomTypeById);

module.exports = router;