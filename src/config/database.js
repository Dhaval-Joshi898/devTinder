const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dhavaljoshi:RJIntSryovdzBB1x@nodeproj.x5f60dw.mongodb.net/"
  );
  
};

// connectDB().then(() => {
//   console.log("Database is connected");
// }).catch((err)=>{
//     console.error("database connection error",err)
// });

module.exports=connectDB
