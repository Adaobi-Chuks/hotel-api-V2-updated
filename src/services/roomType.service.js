const RoomType = require('../models/roomType.model');
const {V} = require("../constants/constants");

class RoomTypeService {

    //create roomtype
    async addRoomType(type) {
        return await RoomType.create(type);
    }

    //get a roomtype with a filter
    async getRoomType(filter) {
        return await RoomType.findOne(filter, V);
    }

    //get all roomtypes
    async getAllRoomTypes() {
        return await RoomType.find({}, V);
    }

    //delete room type using an id
    async deleteRoomTypeById(id) {
        return await RoomType.findOneAndDelete(id);
    }

}

module.exports = new RoomTypeService();