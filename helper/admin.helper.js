
const joi = require("joi");
const { ObjectId } = require("mongodb");
const db = require("../shared/mongo");


//  signUpSchema
const signUpSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(20).required(),
});

//  loginSchema
const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(20).required(),
});

// admin validate Schema
const helper = {
  validateSignUpSchema(user) {
    try {
      return signUpSchema.validateAsync(user);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },
  validateLoginSchema(user) {
    try {
      return loginSchema.validateAsync(user);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },
  createUser(user) {
    return db.admin.insertOne(user);
  },
  findByEmailId(email) {
    return db.admin.findOne({ email });
  },
};

// export
module.exports = helper;
