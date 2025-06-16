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

module.exports={
    adminAuth
}
