const express = require("express");
const {adminAuth}=require("./middlewares/adminAuth")
const app=express()

// app.use("/admin",(req,res)=>{

//     // const token="xyz"
//     // if(token==="xyz"){
//     //     console.log("Admin auth")
//     //     next()
//     //     // res.send("admin is authorized")
//     // }
//     // else{
//     //     res.send("admin not authorized")
//     // }
  

// })

app.get("/admin/getData",adminAuth,(req,res)=>{
    res.send("Admin is authoirzed and gettign data")
})
app.get("/admin/delete",(req,res)=>{
    res.send("Admin is authoirzed and DELETING data")
})


// app.get("/test/:name/:surname", (req, res) => {
//   console.log('anme',req.params)
//   res.send({
//     firstName: "Dhaval",
//     lastName: "Joshi",
//   });
// });

// app.post("/user", (req, res) => {
//   res.send("Data send to database");
// });

// app.delete("/remove", (req, res) => {
//   res.send("Data deleted from DB");
// });
app.listen(9999);
