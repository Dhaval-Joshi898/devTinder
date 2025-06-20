const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./Models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validation } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")

// app.use("/admin", (req, res, next) => {
//   res.send("Only admin route");
// });

app.use(express.json()); //middleware to convert req coming in JSON to HS object so express server could understand+
app.use(cookieParser()); //middleware to read cookie otherwise guves undefined it not added this middleware

//Passingthe express router (authRouter it will check /signup /login in this if not foudn then go to other)
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)


// app.get("/profile", userAuth, async (req, res) => {
//   try {
//     //From userAuth req.userData is set where we are getting user
//     const user = req.userData;
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Log In again:" + err.message);
//   }
// });

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.userData;
  res.send(
    user.firstName + " " + user.lastName + " Send you a connection request"
  );
});

connectDB().then(() => {
  console.log("DB connected");
  app.listen(9999, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
