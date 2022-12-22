const helper = require("../helper/products.helper");
const cloudinary = require("./cloudinary.service");

// service
const service = {
  async getAllProducts(req, res) {

    try {
      const data = await helper.find();
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: "cannot fetch products" });
    }
  },
  async getProductsById(req, res) {
    try {
      const data = await helper.findById(req.params.id);
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: `cannot fetch this id ${req.params.id}` });
    }
  },
  async createProducts(req, res) {
    try {
      // data validation
      const data = await helper.validate(req.body);
      // img
      if(data.img){
        data.img = await cloudinary.uploader.upload(data.img,{
          upload_preset:"product"
        })
      }
      // img1
      if(data.img1){
        data.img1 = await cloudinary.uploader.upload(data.img1,{
          upload_preset:"product"
        })
      }
      // img2
      if(data.img2){
        data.img2 = await cloudinary.uploader.upload(data.img2,{
          upload_preset:"product"
        })
      }
      // insert data
      const insertData = await helper.create(data);
      res.send(insertData);

    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: "incorrect data try again" });
    }
  },
  async updateProducts(req, res) {
    try {
      // data validation
      const newPost = await helper.validate(req.body);
      // img
      if (newPost.img){
        newPost.img = await cloudinary.uploader.upload(newPost.img, {
        upload_preset: "product"
      })
    }
    // img1
    if (newPost.img1){
      newPost.img1 = await cloudinary.uploader.upload(newPost.img1, {
      upload_preset: "product"
    })
  }
  // img2
  if (newPost.img2){
    newPost.img2 = await cloudinary.uploader.upload(newPost.img2, {
    upload_preset: "product"
  })
}

      // post validation
      const oldPost = await helper.findById(req.params.id);
      if (!oldPost) return res.status(400).send({ error: "id invalid" });
      // update data
      const { value } = await helper.update({ _id: oldPost._id, ...newPost });
      res.send(value);
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: error.message });
    }
  },
  async deleteProductsById(req, res) {
    try {
      // check productId
      const productId = await helper.findById(req.params.id);
      if (!productId)
        return res.status(400).send({ error: "product id invalid" });
      // delete data
      await helper.deleteById(productId._id);
      res.end("Product is deleted");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};

module.exports = service;