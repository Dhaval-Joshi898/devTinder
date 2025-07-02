const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user")
const cors=require("cors")

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
})) //to allow frontend to req backend or to know backend that allow req form frontend

app.use(express.json()); //middleware to convert req coming in JSON to JS object so express server could understand+
app.use(cookieParser()); //middleware to read cookie otherwise guves undefined it not added this middleware

//Passingthe express router (authRouter it will check /signup /login in this if not foudn then go to other)
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


connectDB().then(() => {
  console.log("DB connected");
  app.listen(9999, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
