const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../Models/ConnectionRequest");

// requestRouter.post("/request/send", userAuth, (req, res) => {
//   try {
//     const user = req.userData;
//     res.send(
//       user.firstName + " " + user.lastName + " Send you a connection request"
//     );
//   } catch (err) {
//     res.send("Error" + err.message);
//   }
// });
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.userData._id; //getting this from userAuth attaching it to req
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //checking the case where sender is sending request to own
      if (fromUserId == toUserId) {
        console.log(fromUserId == toUserId);
        throw new Error("You Cannot send to request to own(you)");
      }

      //if the to user  exist in user db or not in our app
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error(
          "The request you are sending to person in not in the DB,does not exist"
        );
      }

      //is status Interested or ignored only
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Status is not valid for this req");
      }

      //also schecking if the sender(fromUser) has already send the REQ (toUser)
      //OR the (toUSer has send the req to from user  basically dhaval to steve OR steve to dhaval)
      const existingConnectRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectRequest) {
        throw new Error("Connection request Already exists");
      }

      //after checking the validation create the instance (document)
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.userData.firstName +
          " " +
          (status === "interested" ? "interested in" : "ignored") +
          " " +
          toUser.firstName,
        data,
      });
    } catch (err) {
      res.send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.userData;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is not valid" });
      }

      //to check and find is the connectionRequest is there  and toUser is loggedin user only

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.json({ message: "Connection Request not found" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        message: "You have " + status + "the request",
        connectionRequest,
      });
    } catch (err) {
      res.send("ERROR" + err.message);
    }
  }
);

module.exports = requestRouter;
