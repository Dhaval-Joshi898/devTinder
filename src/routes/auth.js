const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const { validation } = require("../utils/validation");
const authRouter = express.Router();

//Post the data (ADD DATA TO THE DATABSE)(//instead of app we will use approuter it works same as app. alla thing same)
authRouter.post("/signup", async (req, res) => {
  //created an instance of the MODEL (User)
  try {
    const { firstName, lastName, emailId, password } = req.body;
    //Validate the data from the client i.e(req.body)
    validation(req);

    //Encrypt the password before storing to the DB
    const passwordHash = await bcrypt.hash(password, 10);
    // Store hash in your password DB.
    console.log(passwordHash); //i have got the hash value of my password

    //Then save it to the DB

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save(); //this return promise that why asyn await used
    res.send(
      "dynamic User data added Successfully!!!!!!Name of user is :" +
        user.firstName +
        " " +
        user.lastName
    );
  } catch (err) {
    res.status(400).send("Error saving the user,data not added:" + err.message);
  }
});

//Post Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // console.log(emailId)
    const userData = await User.findOne({ emailId: emailId });

    // console.log(userData.password)
    if (!userData?.emailId) {
      throw new Error("Email Id is not correct,enter valid email");
    }

    const isPasswordValid = await bcrypt.compare(password, userData?.password);

    if (isPasswordValid) {
      //Creating JWT token
      const jwtToken = await jwt.sign(
        { _id: userData?._id },
        "dhaval@devTinder$",
        { expiresIn: "1d" }
      ); //hiding id and passing secret key
      //  console.log("TOKEN>",token)

      //creating cookie to  store tokens and---> sending it back to the user{}
      res.cookie("token", jwtToken);

      res.send(
        "Logged in Successsfully!!! " +
          userData.firstName +
          " " +
          userData.lastName
      );
    } else {
      throw new Error("Password is not correct .Please try correct one");
    }
  } catch (err) {
    res.status(400).send("Error to login:" + err);
  }
});

module.exports = authRouter;
