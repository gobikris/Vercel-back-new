const helper = require("../helper/orders.helper");
const authHelper = require("../helper/auth.helper")

const service = {
  async getAllOrders(req, res) {
    try {
      const data = await helper.find();
      res.send(data);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: "can't find orders" });
    }
  },

  async getAllOrdersById(req, res){
    console.log(req.user);
    try {

      const data = await helper.findByUserId(req.user._id);
      console.log(req.user._id);
      res.send(data);

    } catch (error) {
      console.log("error", error.message);
      res.status(500).send({ error: `can't find this id ${req.user._id}`});
    }
  },

  async getOrdersById(req, res) {
    try {
      const data = await helper.findById(req.params.id);
      res.send(data);

    } catch (error) {

      console.log("error", error.message);
      res.status(500).send({ error: `can't find this id ${req.params.id}` });

    }
  },

  async createOrders(req, res) {
    try {
      // data validation
      const order = await helper.validate(req.body);
      
      // const user = await authHelper.findById(order.userId);
      // if(!user) return res.status(400).send({ error: "user Invalid"})

      const {insertedId: _id} = await helper.create({...order,
        userId: req.user._id, 
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
      res.send({ _id, ...order });
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: "Incorrect orders details" });
    }
  },

  async updateOrders(req, res) {
    try {
      // data validation
      const newOrder = await helper.validateOrderUpdate(req.body); 
      // Order validation
      const oldOrder = await helper.findById(req.params.id);
      if (!oldOrder) return res.status(400).send({ error: "order id invalid" });
      // order id validation
      const user = await authHelper.findById(newOrder.userId);
      if(!user) return res.status(400).send({ error: "Order Id invalid"})
      // update orders
      const { value } = await helper.update({ _id: oldOrder._id, ...newOrder });
      res.send(value);
    } catch (error) {
      console.log("error:", error.message);
      res.status(500).send({ error: error.message });
    }
  },

  async deleteOrdersById(req, res) {
    try {
      // check ordersId
      const order = await helper.findById(req.params.id);
      if (!order)
        return res.status(400).send({ error: "order id is invalid" });
      // delete data
      await helper.deleteById(order._id);
      res.end("Deleted");
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};

module.exports = service;
