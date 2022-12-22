const jwt = require("jsonwebtoken");

const middleware = {

async auth_Service(req,res,next){
  req.user = null;
  try {
    if(req.headers && req.headers.authorization){
      const [_,token] = req.headers.authorization.split(" ");
      req.user = await jwt.verify(token,process.env.JWT_SECRET);
      console.log(req.user);
      next();
    }else{
      res.status(403).send({error:"No authorization"});
    }
  } catch (error) {
    res.status(403).send({ error: error.message});
  }
  
},

  logging(req, res, next) {
    console.log(`${new Date()} - ${req.method}- ${req.url}`);
    next();
  },
  maintenance(req, res, next) {
    process.env.IS_MAINTENANCE == "true"
      ? res.send({
          Message: "Site Is Under Maintenance Plz Try After Sometime",
        })
      : next();
  },
};
module.exports = middleware;
