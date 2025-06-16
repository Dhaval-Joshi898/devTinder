const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./Models/user");

// app.use("/admin", (req, res, next) => {
//   res.send("Only admin route");
// });

app.post("/signup", async (req, res) => {
  //created an instance of the MODEL (User)
  const user = new User({
    firstName: "JAIDEN",
    password: "jaiden@123",
    lastName: "Joshi",
    emailId: "jaiden@gmai.com",
  });

  try {
    await user.save(); //this return promise that why asyn await used
    res.send("User data added Successfully!!!!!!");
  } catch (err) {
    res.status(500).send("Data not added");
  }
});

connectDB().then(() => {
  console.log("DB connected");
  app.listen(9999, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
