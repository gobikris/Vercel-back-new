const helper = require('../helper/auth.helper');
const bcrypt = require("bcrypt");
const jwt =  require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;
const nodemailer = require("nodemailer");

const authService = {
  // Sign Up

  async signUp(req, res) {
    try {
      // data validate
      const user = await helper.validateSignUp(req.body);

      // Existing user
      const userExist = await helper.findByEmail(user.email);
      if (userExist)
        return res.status(400).send({ error: "User already exists" });

      // Generate password
      user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());

      // Create new user
      const { insertedId } = await helper.createUser({
        ...user,
        date: new Date(),
      });
      
      res.send({ message: "Sign Up Successfully", userId: insertedId });
    } catch (error) {
      res.status(500).send({ error: error.message });
      alert({ error: error.message });
    }
  },

  // sign In

  async signIn(req, res) {
    try {
      // data validate
      const user = await helper.validateSignIn(req.body);

      //Existing user
      const dbUser = await helper.findByEmail(user.email);
      if (!dbUser) return res.status(400).send({ error: "User doesn't exist" });

      // password validate
      const isSame = await bcrypt.compare(user.password, dbUser.password);
      if (!isSame) return res.status(401).send({ error: "Wrong Password" });

      // Generate Auth token
      const authToken = await jwt.sign(
        { _id: dbUser._id, email: dbUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
      );

      res.send({ message: "Sign in Successfully", authToken });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async forgetPassword(req, res) {
    try {

      // email validation
      const user = await helper.validateEmail(req.body);

      // user existing validation
      const { email } = await helper.findByEmail(user.email);
      if (!email) return res.status(400).send({ error: "user already exist" });

      // check userId
      const { _id } = await helper.findByEmail(user.email);
      const id = ObjectId(_id).valueOf();

      // Token generation
      const authToken = await jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      // Nodemailer
      const sender = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      const composeEmail = {
        from: process.env.USER,
        to: email,
        subject: "Password Verification",
        text: `${process.env.BASE_URL}/${id}/${authToken}`,
      };

      sender.sendMail(composeEmail, function (error, info) {
        if (error) {
          console.log(error);
          res.status(400).json({ yo: "error" });
        } else {
          console.log("Message sent: " + info.response);
          res.sendStatus(200);
        }
        return res.sendStatus(200);
      });

    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  // resetPassword 
  async resetPassword(req, res) {
    try {
      const { password } = await helper.validatePassword(req.body);

      // verify token
      const updatedHashPassword = await bcrypt.hash(
        password.toString(),
        await bcrypt.genSalt(10)
      );

      // check userId
      const userId = await helper.findById(req.params.id);
      const updatePassword = await helper.update({
        _id: userId._id,
        updatedHashPassword,
      });

      res.send(updatePassword);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
 
};

module.exports = authService;