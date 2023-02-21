const UserService = require('../services/user.service');
const bcrypt = require("bcrypt");
const { editUserById } = require('../services/user.service');
const {
    CREATED, 
    FETCHED, 
    FETCHEDALL, 
    UPDATED, 
    DELETED, 
    DUPLICATE_ERROR, 
    INVALID_ID_ERROR,
    INVALID_EMAIL_ERROR,
    INVALID_PASSWORD_ERROR,
    LOGIN
} = require("../constants/constants").MESSAGES.USER;


class UserController {

    //create user
    async createUser(req, res) {

        const data = req.body;
        
        //checks if another user with email exists
        if (await UserService.userExists(data.email)) {
            //sends an error if the email exists
            return res.status(409)
            .send({
                message: DUPLICATE_ERROR,
                success: false
            });
        }

        //create a user if the email doesn't exist
        const createdUser = await UserService.createUser(data);
        const token = UserService.generateAuthToken(createdUser);
        return res.header("token", token).status(201)
            .send({
                message: CREATED,
                success: true,
                data: {createdUser, token}
            });
    }

    async getUsers(req, res) {
        const users = await UserService.getAllUsers();
        res.status(200).send({
          success: true,
          message: FETCHEDALL,
          data: users
        });
    }

    async getUserById(req, res) {
        const user = await UserService.findById(req.params.id);
    
        if (!user) {
          return res.status(404).send({
            success: false,
            message: INVALID_ID_ERROR
          });
        }

        res.status(200).send({
          success: true,
          message: FETCHED,
          data: user
        });
    }

    async editUser(req, res) {
        const id = req.params.id;
        const data = req.body;
        const user = await UserService.findById(id);
        if(!user) return res.status(404).json({
            message: INVALID_ID_ERROR,
            success: false
        })
        // Fetching existing user email
        if(data.email){
            const existingRoomEmail  = await UserService.find(data.email)
            if(existingRoomEmail){
                if(existingRoomEmail._id.toString() !== id){
                    return res.status(403).json({
                        success: false,
                        message: DUPLICATE_ERROR
                    })
                }
            }
        }
        const updatedUser = await editUserById(id, data)
        return res.status(200).json({
            success: true,
            message: UPDATED,
            data: updatedUser
        })
    }
    
    async deleteUserById(req, res) {
        const id = req.params.id;
        //check to see if a roomtype with id exists
        const userToDelete = await UserService.findById({_id: id});
        //deletes the roomtype if the id exist
        if(userToDelete) {
            await UserService.deleteUserById(id);
            return res.status(201).send({
                message: DELETED,
                success: true,
                data: userToDelete
            });
        }
        //sends an error if the id doesn't exists
        return res.status(404)
            .send({
                success: false,
                message: INVALID_ID_ERROR
            });   
    }
    
    async login(req, res) {
        const user = await UserService.find(req.body.email);
        if (!user) return res.status(400).send({ success: false, message: INVALID_EMAIL_ERROR });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send({ success: false, message: INVALID_PASSWORD_ERROR });

        const token = UserService.generateAuthToken(user);

        res.header('token', token).status(200).send({
            success: true,
            message: LOGIN,
            data: { user, token }
        });
    }

}
module.exports = new UserController();