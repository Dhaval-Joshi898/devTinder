const mongoose = require("mongoose");
const User=require("../Models/user")

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:User,  //reference to the User collection 
      required:true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:User,
      required:true
    },
    status:{
      type:String,
        enum:{
            values:["accepted","rejected","ignored","interested"],
            message:`{VALUE} is incorrect Status type`
        },
      required:true
    }
  },
  { timestamps: true }
);

connectionRequestSchema.index({fromUserId:1,toUserId:1})  //compound indexe to make queries faster

const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequestModel;