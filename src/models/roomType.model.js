const {model, Schema} = require('mongoose');
const {DATABASES} = require("../constants/constants");

const RoomTypeSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  }
});

const RoomType = model(DATABASES.ROOMTYPE, RoomTypeSchema);
module.exports = RoomType;