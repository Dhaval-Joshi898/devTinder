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
  }).populate("fromUserId", "firstName lastName age photoUrl about skills ");
  //   }).populate("fromUserId",["firstName" "lastName"]);

  res.send({
    message: "Here is the requests sent to you by following people",
    data: connectionRequest,
  });
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.userData;

  const acceptedConnectionRequests = await ConnectionRequestModel.find({
    $or: [{ fromUserId: loggedInUser._id,status: "accepted" }, { toUserId: loggedInUser._id ,status: "accepted"}],
    
  })
    .populate("fromUserId", "firstName lastName age skills about photoUrl")
    .populate("toUserId", "firstName lastName age skills about photoUrl");

  const sendBy = acceptedConnectionRequests.map((row) => {
    //the acceptedCOnenctionRequest will habve data form user colelction of both form and to but i want the one whihc is not loggedin user
    if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
      return  row.toUserId;
    }
    else{
        return row.fromUserId;
    }
  });

  res.send({ message: "Your conection Request", data: sendBy });
});

module.exports = userRouter;
