const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors=require("cors")
const http=require("http");
require("dotenv").config();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
})) //to allow frontend to req backend or to know backend that allow req form frontend

app.use(express.json()); //middleware to convert req coming in JSON to JS object so express server could understand+
app.use(cookieParser()); //middleware to read cookie otherwise guves undefined it not added this middleware

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
const postRouter = require("./routes/post");
const otpRouter = require("./routes/otpRoute");
const notificationRouter = require("./routes/notificationRoute");

//Passingthe express router (authRouter it will check /signup /login in this if not foudn then go to other)
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/",chatRouter)
app.use("/",postRouter)
app.use("/",otpRouter)
app.use("/",notificationRouter)

const server=http.createServer(app); //app is existing server application for socket i have used that app tp create server
//IMPORTANT:now after this i will chnage listen form app.listen to-----> server.listen

initializeSocket(server);  //initializing socket utils/socket.js

connectDB().then(() => {
  console.log("DB connected");
  server.listen(process.env.PORT, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
