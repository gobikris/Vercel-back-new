const db = require("../shared/mongo");
const ObjectId = require("mongodb").ObjectId;
const joi = require("joi");
// create schema
const ordersSchema = joi.object({
  token: joi.object().required(),
  product: joi.array().required(),
  total: joi.number().required(), 
  status: joi.string().required(),
})

// UpdateOrder
const UpdateOrder = joi.object({
  userId: joi.string().required(),
  token: joi.object().required(),
  product: joi.array().required(),
  total: joi.number().required(),
  status: joi.string().required(),
});

const helper = {
  validate(post) {
    try {
      return ordersSchema.validateAsync(post);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },
  validateOrderUpdate(post){
    try {
        return UpdateOrder.validateAsync(post);
    } catch ({ details: [{ message }] }) {
    throw new Error(message);
    }
  },
  find() {
    return db.orders.find().toArray();
  },
  findByUserId(userId){
    console.log("userId:", userId);
    return db.orders.find({userId: userId}).toArray();
  },
  findById(_id) {
    return db.orders.findOne({ _id: ObjectId(_id) });
  },
  create(post) {
    return db.orders.insertOne(post);
  },
  update({ _id, ...post }) {
    return db.orders.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: post },
      { returnDocument: "after" }
    );
  },
  deleteById(_id) {
    return db.orders.deleteOne({ _id: ObjectId(_id) });
  },
};

module.exports = helper;
