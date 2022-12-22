
const router = require("express").Router();
const KEY = process.env.STRIPE_KEY;
const stripe = require("stripe")(KEY);
const uuid = require("uuid").v4;

router.post("/payment", async (req, res) => {
  console.log(req.body);
  let error;
  let status;
  try {
    const { product, token } = req.body;
    const customer = await stripe.customers.create({
      name: token.name,
      email: token.email,
      source: token.id,
    });
    const key = uuid();
     const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "INR",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        key,
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.log("Error:", error);
    status = "failure";
  }
  res.json({ error, status });
});



module.exports = router;