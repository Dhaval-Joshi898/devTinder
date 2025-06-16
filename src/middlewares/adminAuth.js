const adminAuth = (req, res,next) => {
  const token = "xyz";
  if (token === "xyz") {
    console.log("Admin auth");
    next();
    // res.send("admin is authorized")
  } else {
    res.send("admin not authorized");
  }
};
const userAuth = (req, res,next) => {
  const token = "xyz";
  if (token === "xyz") {
    console.log("Admin auth");
    next();
    // res.send("admin is authorized")
  } else {
    res.send("USer not authorized,need to login");
  }
};

module.exports={
    adminAuth,
    userAuth
}
