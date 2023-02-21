const User = require('../models/user.model');
const {V, MAXAGE} = require("../constants/constants");
const _ = require("lodash");
const {isValidObjectId} = require("mongoose");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

class UserService {

    //checks if user exists
    async userExists(emailOrId) {
        const user = await this.find(emailOrId);
        return !(_.isEmpty(user));
    }

    //finds a user by email or id
    async find(data) {
        if (isValidObjectId(data)) {
            return await this.findById(data);
        } else {
            return await this.findByEmail(data);
        }
    }
    
    //finds a user by email
    async findByEmail(email) {
        return await User.findOne({email});
    }

    //finds a user by id
    async findById(id) {
        return await User.findById(id);
    }

    //create room
    async createUser(user) {
        return await User.create(user);
    }

    //get all users
    async getAllUsers() {
        return await User.find({}, V);
    }

    //edit user details with id
    async editUserById(id, obj) {
        return await User.findOneAndUpdate(id, { $set: obj }, { new: true });
    }

    //deleting a user details with an id
    async deleteUserById(id) {
        return await User.findOneAndDelete(id);
    }

    //creates a json web token
    generateAuthToken (user) {
        return jwt.sign({
            _id: user.id,
            email: user.email,
            role: user.role
        }, secret, {
            expiresIn: MAXAGE
        });
    };
}

module.exports = new UserService();