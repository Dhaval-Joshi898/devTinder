const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const OTP=require("../Models/Otp")

//Post the data (ADD DATA TO THE DATABSE)(//instead of app we will use approuter it works same as app. alla thing same)
// authRouter.post("/signup", async (req, res) => {
//   //created an instance of the MODEL (User)
//   try {
//     const { firstName, lastName, emailId, password } = req.body;
//     //Validate the data from the client i.e(req.body)
//     validateSignUpData(req);

//     //Encrypt the password before storing to the DB
//     const passwordHash = await bcrypt.hash(password, 10);
//     // Store hash in your password DB.
//     console.log(passwordHash); //i have got the hash value of my password

//     //Then save it to the DB

//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//     });

//     const savedUser=await user.save(); //this return promise that why asyn await used

//     const jwtToken = await jwt.sign(
//       { _id: savedUser?._id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );
//      res.cookie("token", jwtToken);

//     res.json({message:"User Signed Up",data:savedUser} );
//   } catch (err) {
//     res.status(400).send("Error saving the user,data not added:" + err.message);
//   }
// });
authRouter.post("/signup", async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      emailId,
      password,
      otp
    } = req.body;

    // Validate input
    validateSignUpData(req);

    // Check existing user
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email: emailId,
    });

    if (!otpRecord) {
      throw new Error("OTP expired or not found");
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      isVerified: true
    });

    const savedUser = await user.save();

    // Delete OTP after successful signup
    await OTP.deleteMany({
      email: emailId
    });

    // Create JWT
    const jwtToken = jwt.sign(
      { _id: savedUser?._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,        // must be true in production (HTTPS)
      sameSite: "none",    // required for cross-site frontend/backend
    });

    res.json({
      message: "User Signed Up Successfully",
      data: savedUser,
    });

  }
  catch (err) {

    res.status(400).send(
      "Error saving the user: " + err.message
    );

  }

});

//Post Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // console.log(emailId)
    const userData = await User.findOne({
      emailId: emailId?.trim().toLowerCase(),
    });

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
        {
          expiresIn: "1d",
        }
      ); //hiding id and passing secret key
      //  console.log("TOKEN>",token)

      //creating cookie to  store tokens and---> sending it back to the user{}
      res.cookie("token", jwtToken);

      res.send(userData);
      //   res.send({message:
      //     "Logged in Successsfully!!! " + userData.firstName +  " " +
      //       userData.lastName,
      //       data:userData
      // });
    } else {
      throw new Error("Password is not correct .Please try correct one");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) }); //either this way
  // res.clearCookie("token"); or THIS way
  res.send("Logged out ,Login  again");
});
module.exports = authRouter;
