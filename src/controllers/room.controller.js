const {addRoom, deleteRoomById, editRoomById, getAllRooms, getRoom} = require('../services/room.service');
const {CREATED, FETCHED, FETCHEDALL, UPDATED, DELETED, DUPLICATE_ERROR, INVALID_ID_ERROR} = require("../constants/constants").MESSAGES.ROOM;
const {ZERO, I} = require("../constants/constants");

class Controller {

    //create room
    async addRoom(req, res) {
        const body = req.body;
        //check to see if a room with name exists
        const existingRoom = await getRoom({name: body.name.toLowerCase()});
        //sends an error if the name exists
        if(existingRoom) {
            return res.status(403)
                .send({
                    message: DUPLICATE_ERROR,
                    success: false
                });
        }
        //create a room if the name doesn't exist
        const createdRoom = await addRoom(body);
        return res.status(201)
            .send({
                message: CREATED,
                success: true,
                data: createdRoom
            });
    }

    //get room using id
    async getRoomById(req, res) {
        const id = req.params.id;
        //check to see if a room with id exists
        const roomToGet = await getRoom({_id: id});
        //return a status of ok if the room exists
        if(roomToGet) return res.status(200)
            .send({
                message: FETCHED,
                success: true,
                data: roomToGet
            });
        //sends an error if the room doesn't exists
        return res.status(404)
            .send({
                message: INVALID_ID_ERROR,
                success: false
            });
        // return await Room.findOne({_id: id});
    }

    //get all rooms with some queries
    async getAllRooms(req, res) {
        const {search, roomType, minPrice = ZERO, maxPrice = Number.MAX_SAFE_INTEGER} = req.query;
        let queries = {};
        if (search) {
            queries.codeName = {$regex: new RegExp(search.toLowerCase(), I)}
        }
        if (roomType) {
            queries.roomType = roomType;
        }
        if (minPrice) {
            queries.prize = {$gte: parseInt(minPrice)}
        }
        if (maxPrice) {
            queries.prize = {$lte: parseInt(maxPrice)}
        }
        const rooms = await getAllRooms(queries);
        return res.status(200)
            .send({
                message: FETCHEDALL,
                success: true,
                data: rooms
            });
    }

    //edit room details with id
    async editRoomById(req, res) {
        const id = req.params.id;
        const data = req.body;
        // Fetch the room with the id
        const existingRoom = await getRoom({_id: id});
        if(!existingRoom) return res.status(404).json({
            message: INVALID_ID_ERROR,
            success: false
        })
        // Fetching existing book title
        if(data.name){
            const existingRoomName  = await getRoom({name: data.name.toLowerCase()})
            if(existingRoomName){
                if(existingRoomName._id.toString() !== id){
                    return res.status(403).json({
                        success: false,
                        message: DUPLICATE_ERROR
                    })
                }
            }
        }
        const updatedRoom = await editRoomById(id, data)
        return res.status(200).json({
            success: true,
            message: UPDATED,
            data: updatedRoom
        })
    }

    //deleting a room details with an id
    async deleteRoomById(req, res) {
        const id = req.params.id;
        //check to see if a roomtype with id exists
        const roomToDelete = await getRoom({_id: id});
        //deletes the roomtype if the id exist
        if(roomToDelete) {
            await deleteRoomById(id);
            return res.status(201).send({
                message: DELETED,
                success: true,
                data: roomToDelete
            });
        }
        //sends an error if the id doesn't exists
        return res.status(404)
            .send({
                success: false,
                message: INVALID_ID_ERROR
            });    
    }
}

module.exports = new Controller();