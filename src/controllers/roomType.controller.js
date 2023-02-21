const {addRoomType, getRoomType, getAllRoomTypes,deleteRoomTypeById} = require('../services/roomType.service');
const { findById } = require('../services/user.service');
const {CREATED, FETCHED, DELETED, DUPLICATE_ERROR, INVALID_ID_ERROR} = require("../constants/constants").MESSAGES.ROOMTYPE;

class RoomTypeController {

    //create roomtype
    async addRoomType(req, res) {
        const body = req.body;
        //check to see if a roomtype with name exists
        const existingRoomType = await getRoomType({name: body.name.toLowerCase()});
        //create a room type if the name doesn't exist
        if(existingRoomType) {
            return res.status(403)
                .send({
                    message: DUPLICATE_ERROR,
                    success: false
                });
        }
        //sends an error if the name exists
        const createdRoomType = await addRoomType(body);
        return res.status(201)
            .send({
                message: CREATED,
                success: true,
                data: createdRoomType
            });
    }

    //get all roomtypes
    async getAllRoomTypes(req, res) {
        const roomTypes = await getAllRoomTypes();
        res.status(201)
            .send({
                message: FETCHED,
                success: true,
                data: roomTypes
            });
    }

    async getRoomTypeById(req, res) {
        const id = req.params.id;
        const roomType = await getRoomType({_id: id});
    
        if (!roomType) {
          return res.status(404).send({
            success: false,
            message: INVALID_ID_ERROR
          });
        }

        res.status(200).send({
          success: true,
          message: FETCHED,
          data: roomType
        });
    }
    
    //delete room type using an id
    async deleteRoomTypeById(req, res) {
        const id = req.params.id;
        //check to see if a roomtype with id exists
        const roomTypeToDelete = await getRoomType({_id: id});
        //deletes the roomtype if the id exist
        if(roomTypeToDelete) {
            await deleteRoomTypeById(id);
            return res.status(201).send({
            message: DELETED,
            success: true,
            data: roomTypeToDelete
        });}
        //sends an error if the id doesn't exists
        return res.status(404)
            .send({
                success: false,
                message: INVALID_ID_ERROR
            });
    }
}

module.exports = new RoomTypeController();