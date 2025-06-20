const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")

app.use(express.json()); //middleware to convert req coming in JSON to HS object so express server could understand+
app.use(cookieParser()); //middleware to read cookie otherwise guves undefined it not added this middleware

//Passingthe express router (authRouter it will check /signup /login in this if not foudn then go to other)
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)


connectDB().then(() => {
  console.log("DB connected");
  app.listen(9999, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
