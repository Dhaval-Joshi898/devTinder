const express = require("express");
const connectDB = require("./config/database");
const app = express();

app.use("/admin", (req, res, next) => {
  res.send("Only admin route");
});

connectDB().then(() => {
  console.log("DB connected");
  app.listen(9999, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
