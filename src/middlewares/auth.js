const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userAuth = async (req, res, next) => {
  try {
    //to check if the token is correct and let access the user things
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token does not exist");
    }

    //validating token
    const decodedData = await jwt.verify(token, "dhaval@devTinder$");
    console.log(decodedData._id); //_id which was given at time of creating jwt}

    //finding user if token vlaidated
    // based on this id got the info of logged in USER
    const userData = await User.findOne({ _id: decodedData._id });

    if (!userData) {
      throw new Error("User not found");
    }

    req.userData = userData; //so when next route handler will called in its req this userData will be attached
    next();
    
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
};

module.exports = {
  userAuth,
};
