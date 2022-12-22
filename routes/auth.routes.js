const router = require("express").Router();
const service = require("../service/auth.service");

router.post("/signup",service.signUp);
router.post("/signin",service.signIn);
router.post("/forgot",service.forgetPassword);
router.post("/reset/:id/:token",service.resetPassword);




module.exports =router;