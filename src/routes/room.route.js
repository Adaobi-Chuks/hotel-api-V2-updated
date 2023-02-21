const {addRoom, getRoomById, getAllRooms, editRoomById, deleteRoomById} = require('../controllers/room.controller');
const express = require('express');
const router = express.Router();
const {authenticate} = require("../middlewares/authentication.middleware");
const {authorizeAdmin} = require("../middlewares/authorization.middleware");
const {validateRoom} = require("../middlewares/roomValidation.middleware");

//create a room
router.post("/", authenticate, authorizeAdmin, validateRoom, addRoom);

//get room using id
router.get("/:id", getRoomById);

//get all rooms with some queries
router.get("/", getAllRooms);

//edit room details with id
router.patch("/:id", authenticate, authorizeAdmin, validateRoom.bind(null, true), editRoomById);

//deleting a room details with an id
router.delete("/:id", authenticate, authorizeAdmin,  deleteRoomById);

module.exports = router;