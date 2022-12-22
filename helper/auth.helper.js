const joi = require("joi");

const {ObjectId}= require("mongodb");

const db = require("../shared/mongo");

// Sign Up required validate

const signUpSchema = joi.object({
    fullname:joi.string().required(),
    email:joi.string().email().required(),
    contact:joi.number().required(),
    password:joi.string().min(3).max(15).required(),
});

// Sign Up required validate

const signInSchema = joi.object({
   email:joi.string().email().required(),
   password:joi.string().min(3).max(15).required(),
});

// forgot password required validate

const emailSchema = joi.object({
   email:joi.string().email().required(),
});

// password required validate
const passwordSchema = joi.object({
   password:joi.string().required()
});


// these are all db queries

const helper = {
     validateSignUp(user){
        try {
            return signUpSchema.validateAsync(user);
        } catch ({details:[{message}]}) {
            throw new Error(message);
        }
     },

     validateSignIn(user){
      try {
          return signInSchema.validateAsync(user);
      } catch ({details:[{message}]}) {
          throw new Error(message);
      }
   },

   validateEmail(user){
      try {
         return emailSchema.validateAsync(user);
      } catch ({details:[{message}]}) {
            throw new Error(message);
      }
   },

   validatePassword(user){
      try {
         return passwordSchema.validateAsync(user);
      } catch ({details:[{message}]}) {
         throw new Error(message);
      }
   },

   update({ _id, updatedHashPassword }) {
      return db.users.updateOne(
        { _id: ObjectId(_id) },
        { $set: { password: updatedHashPassword } },
        { returnDocument: "after" }
      );
    },

    findByEmailId(email) {
      return db.users.findOne({ email });
    },

       findByEmail(email){
        return db.users.findOne({email});
     },

       findById(_id){
        return db.users.findOne({_id: ObjectId(_id) });

     },
     createUser(user){
        return db.users.insertOne(user)
     }
}

module.exports = helper;