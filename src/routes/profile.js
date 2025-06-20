const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, (req, res) => {
  try {
    //From userAuth req.userData is set where we are getting user
    const user = req.userData;
    res.send(user);
  } catch (err) {
    res.status(400).send("Log In again:" + err.message);
  }
});

module.exports=profileRouter;