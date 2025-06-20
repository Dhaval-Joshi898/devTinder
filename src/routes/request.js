const express = require("express");
const requestRouter = express.Router();
const {userAuth}=require("../middlewares/auth")

requestRouter.post("/request/send",userAuth, (req, res) => {
  try {
    const user = req.userData;
    res.send(
      user.firstName + " " + user.lastName + " Send you a connection request"
    );
  } catch (err) {
    res.send("Error"+ err.message)
  }
});

module.exports=requestRouter;