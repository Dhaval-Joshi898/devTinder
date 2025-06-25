const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../Models/ConnectionRequest");
const User = require("../Models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).send("ERROR", err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;

    const acceptedConnectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName age skills about photoUrl")
      .populate("toUserId", "firstName lastName age skills about photoUrl");

    const sendBy = acceptedConnectionRequests.map((row) => {
      //the acceptedCOnenctionRequest will habve data form user colelction of both form and to but i want the one whihc is not loggedin user
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.send({ message: "Your conection Request", data: sendBy });
  } catch (err) {
    res.status(400).send("ERROR", err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;

    const isConnectionRequestPresent = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId ");

    const hideUserFromFeed = new Set();
    //find returns an array
    isConnectionRequestPresent.forEach((row) => {
      hideUserFromFeed.add(row.fromUserId.toString());
      hideUserFromFeed.add(row.toUserId.toString());
    });

    // console.log(hideUserFromFeed)
    //here the check condition is on {_id} not include ids inside the array(set converted to arr) and not equal(toLoggedInUser)
    const allUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    });
    
    res.send(allUsers);
    // res.send(Array.from(hideUserFromFeed));
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

module.exports = userRouter;
