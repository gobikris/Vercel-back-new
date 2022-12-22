const joi = require("joi");
const db = require("../shared/mongo");
const ObjectId = require("mongodb").ObjectId;

const productSchema = joi.object({
  name: joi.string().required(),
  img: joi.string().required(),
  img1: joi.string().required(),
  img2: joi.string().required(),
  fit: joi.string().required(),
  // category:joi.string().required(),
  desc: joi.string().required(),
  price: joi.number().required(),
  rating: joi.number().required(),
  offer: joi.number().required(),
  
});

const helper = {
  validate(post) {
    try {
      return productSchema.validateAsync(post);
    } catch ({ details: [{ message }] }) {
      throw new Error(message);
    }
  },

  find() {
    return db.products.find().toArray();
  },
  findById(_id) {
    return db.products.findOne({ _id: ObjectId(_id) });
  },
  create(post) {
    return db.products.insertOne(post);
  },
  update({ _id, ...post }) {
    return db.products.findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: post },
      { returnDocument: "after" }
    );
  },
  deleteById(_id) {
    return db.products.deleteOne({ _id: ObjectId(_id) });
  },
};

module.exports = helper;