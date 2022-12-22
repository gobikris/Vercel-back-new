const helper = require("../helper/users.helper");
const authHelper = require("../helper/auth.helper");

const service = {
    async getAllUsers(req,res){
        try {
            const data = await helper.find().toArray();
            res.send(data);
        } catch (error) {
            console.log("error:", error.message);
            res.status(500).send({error: "Can't find users"});
        }
    },
    async getUsersById(req,res){
        try {
            const data = await helper.findById(req.user._id);
            res.send(data);
        } catch (error) {
            console.log("error:", error.message);
            res.status(500).send({error: `Can't find users In this ID ${req.params.id}` });
        }
    },
    async updateUsers(req,res){
        try {
            // validate the users 
            const newUser = await authHelper.validateSignUp(req.body);

            // Existing Users Validation
            const oldUser = await authHelper.findById(req.user._id);
            if(!oldUser)
            return res.status(401).send({error:"Invalid User"});

            // Update Users
            const {value} = await helper.update({_id:oldUser._id, ...newUser});
            res.send(value);

        } catch (error) {
            console.log("error:", error.message);
            res.status(500).send({error: error.message});
        }
    },

    async deleteUsersById(req,res){
        try {
            // delete users id
            const usersId = await helper.findById(req.params.id);
            if(!usersId)
            return res.status(401).send({error:"Invalid User ID"});

            // delete users
            await helper.deleteById(usersId._id);
            res.end("Deleted")
        } catch (error) {
            res.status(500).send({error: error.message});
        }
    }
};

module.exports = service;

