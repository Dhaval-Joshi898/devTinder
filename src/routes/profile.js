const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../Models/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const ConnectionRequestModel = require("../Models/ConnectionRequest");
const {upload}=require("../utils/cloudinaryStorage")
const {postUpload}=require("../utils/cloudinaryStorage")

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    //From userAuth req.userData is set where we are getting user
    const user = req.userData;
    res.send(user);
  } catch (err) {
    res.status(400).send("Log In again:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth,upload.single("photo"), async (req, res) => {
  try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid edit request");
      }
      const loggedInUser = req.userData;

      // update text fields
      Object.keys(req?.body).forEach((key) => {
        loggedInUser[key] = req?.body[key];
      });

      // if image uploaded
      if (req?.file) {
        loggedInUser.photoUrl = req?.file?.path;
      }

      await loggedInUser.save();

      res.json({
        message:
          loggedInUser.firstName +
          " Updated Data Successfully",

        data: loggedInUser,
      });
      console.log("UPDATE API CLICKed")
  } catch (err) {
      console.log(err);
      res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/editCloudinary", userAuth, upload.single("photo"),async (req, res) => {
  try {
    console.log(req.file);

    console.log(req.body);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});
module.exports = profileRouter;

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.userData;

    const { currentPassword, passwordToUpdate } = req.body;

    const isPasswordCheck = await bcrypt.compare(
      currentPassword,
      user.password
    );
    // console.log("ispasswordcheck", isPasswordCheck);

    if (!isPasswordCheck) {
      throw new Error(
        "Your current Password added is wrong.Please add correct password to update "
      );
    }

    const updatedPassword = await bcrypt.hash(passwordToUpdate, 10);
    // console.log("OLD password hash", user.password);
    // console.log("NEW udpated password hash:--", updatedPassword);

    user.password = updatedPassword;
    user.save();
    res.json({
      message: user.firstName + ",your password has been updated successfully",
      data: user,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

profileRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.userData._id; //getting this from userAuth attaching it to req
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //checking the case where sender is sending request to own
      if (fromUserId == toUserId) {
        // console.log(fromUserId == toUserId);
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

// try {
// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
// My logic of updating the data
//   // console.log(req.body);
//   const { _id } = req.userData;
//   const { age, about, skills, gender } = req.body;

//   const updatedData = {};
//   const allowedFields = ["age", "about", "skills", "gender","firstName","lastName"];

// req updated data { age: 20, about: undefined, skills: undefined, gender: 'Male' }
// bcoz of above line below logic

//   allowedFields.forEach((field) => {
//     if (req.body[field] !== undefined) {
//       updatedData[field] = req.body[field];
//     }
//   });

//   console.log("req updated data", updatedData);

//   const updatedUser = await User.findOneAndUpdate({ _id: _id }, updateData, {
//     new: true,
//   });
//   // console.log(updatedUser);

//   res.send(updatedUser);
// } catch (err) {
// res.send("ERROR :" + err.message);
// }
