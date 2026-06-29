const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET
  );
  
};

// connectDB().then(() => {
//   console.log("Database is connected");
// }).catch((err)=>{
//     console.error("database connection error",err)
// });

module.exports=connectDB
