const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./Models/user");

// app.use("/admin", (req, res, next) => {
//   res.send("Only admin route");
// });

app.use(express.json()); //middleware to convert req coming in JSON to HS object so express server could understand+

app.post("/signup", async (req, res) => {
  //created an instance of the MODEL (User)
  // console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save(); //this return promise that why asyn await used
    res.send("dynamic User data added Successfully!!!!!!");
  } catch (err) {
    res.status(400).send("Data not added");
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    res.send(users);
  } catch (error) {
    res.status(400).send("NO user exist");
  }
});

// Feed api get all user from DATABASE  find(takes filter if we did {} this brackets it will return all data in db)
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("there is NO user in feed");
  }
});


//Deleting a  User from ID 
app.delete("/user",async (req,res)=>{
  const firstName=req.body.firstName
  console.log(firstName)
  try{
    const delUser=await User.findOneAndDelete({"firstName":firstName});
    console.log(delUser,"deluserslnjeb")
    res.send("user deleted,Name of user:"+delUser.firstName+" "+delUser.lastName)
    
  }
  catch(err){
    res.send("error deleting user")
  }
})

connectDB().then(() => {
  console.log("DB connected");
  app.listen(9999, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
