const joi  = require('joi');
const ObjectId = require("mongodb").ObjectId;
const db = require("../shared/mongo");


// helper functions
const helper = {
    find(){
        return db.users.find();
    },
    findById(_id){
        return db.users.findOne({_id:ObjectId(_id)});
    },
    update({_id,...post}){
        return db.users.findOneAndUpdate(
            {_id:ObjectId(_id)},
            {$set:post},
            {returnDocument:"after"}  
            
        );
    },
    deleteById(_id){
        return db.users.deleteOne({_id:ObjectId(_id)});
    }
};
module.exports = helper;