const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./Models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validation } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

// app.use("/admin", (req, res, next) => {
//   res.send("Only admin route");
// });

app.use(express.json()); //middleware to convert req coming in JSON to HS object so express server could understand+
app.use(cookieParser()); //middleware to read cookie otherwise guves undefined it not added this middleware

//Post Login API
app.post("/login", async (req, res) => {
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
        "dhaval@devTinder$"
      ); //hiding id and passing secret key
      //  console.log("TOKEN>",token)

      //creating cookie to  store tokens and---> sending it back to the user{}
      res.cookie("token", jwtToken);

      res.send("Logged in Successsfully!!!");
    } else {
      throw new Error("Password is not correct .Please try correct one");
    }
  } catch (err) {
    res.status(400).send("Error to login:" + err);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    //From userAuth req.userData is set where we are getting user
    const user = req.userData;
    res.send(user);
  } catch (err) {
    res.status(400).send("Log In again:" + err.message);
  }
});

//Post the data (ADD DATA TO THE DATABSE)
app.post("/signup", async (req, res) => {
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
    res.send("dynamic User data added Successfully!!!!!!");
  } catch (err) {
    res.status(400).send("Error saving the user,data not added:" + err.message);
  }
});

// this will reador find and return it in an ARRAY
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
app.delete("/user", async (req, res) => {
  const firstName = req.body.firstName;
  console.log(firstName);
  try {
    const delUser = await User.findOneAndDelete({ firstName: firstName });
    // console.log("deluser Return object(DOCUMENT) of the data deleted",delUser);
    res.send(
      "user deleted,Name of user:" + delUser.firstName + " " + delUser.lastName
    );
  } catch (err) {
    res.send("error deleting user");
  }
});

//Updating a user info
app.patch("/user/:userId", async (req, res) => {
  //here i am dynamically passing the id /user/:userId and in postman i am doing user/68529453e1c5772752d4b755
  const userId = req.params.userId;
  const data = req.body;

  try {
    //The below logic works as gatekeeping ,to not allow user to UPDATE any Data out of APPROVED fields
    //like they cannot update EMAIL,but htey can update below approved if UPDATED email then it will trhow ERROR
    const approvedKeys = ["gender", "age", "about", "skills"];
    const isKeysApproved = Object.keys(data).every((key) =>
      approvedKeys.includes(key)
    );

    if (!isKeysApproved) {
      throw new Error("Unable to update your given data");
    }
    if (data.skills?.length >= 10) {
      throw new Error("Limit of skills to be added exceeded");
    }

    //If in  field  is checks the approved keys it will find and update
    const updateEmail = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      new: true,
    });
    // console.log(updateEmail);
    res.send("User Data updated:" + updateEmail);
    // res.send("User email updated")
  } catch (err) {
    res.send("Error updating the data: " + err.message);
  }
});

connectDB().then(() => {
  console.log("DB connected");
  app.listen(9999, () => {
    console.log("server  is successfully listening on port 9999....");
  });
});
