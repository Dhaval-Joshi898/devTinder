const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../Models/ConnectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  const loggedInUser = req.userData;
  console.log(loggedInUser);

  //logged in user INTEREST request recieved
  const connectionRequest = await ConnectionRequestModel.find({
    toUserId: loggedInUser._id,
    status: "interested",
  });


  res.send({message:"Here is the requests sent to you by following people",data:connectionRequest})
});

module.exports = userRouter;
