const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Notification = require("../Models/Notification");

const notificationRouter = express.Router();

notificationRouter.get("/notifications", userAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      toUserId: req.userData._id,
    }).populate("fromUserId", "firstName lastName photoUrl").sort({ createdAt: -1 });
    
    res.json({ data: notifications });
  } 
  catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = notificationRouter;
