const Room = require('../models/room.model');
const {V} = require("../constants/constants");

class RoomService {

    //create room
    async addRoom(room) {
        return await Room.create(room);
    }

    //get a room using an id
    async getRoom(filter) {
        return await Room.findOne(filter, V);
    }

    //get rooms with a filter
    async getAllRooms(filter) {
        return await Room.find(filter, V);
    }

    //edit room details with id
    async editRoomById(id, obj) {
        return await Room.findOneAndUpdate(id, { $set: obj }, { new: true });
    }

    //deleting a room details with an id
    async deleteRoomById(id) {
        return await Room.findOneAndDelete(id);
    }

}

module.exports = new RoomService();