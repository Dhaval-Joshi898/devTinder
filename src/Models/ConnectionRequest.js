const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status:{
      type:String,
        enum:{
            values:["accepted","rejected","ignored","interested"],
            message:`{VALUE} is incorrect Status type`
        }
    }
  },
  { timestamps: true }
);

connectionRequestSchema.index({fromUserId:1,toUserId:1})  //compound indexe to make queries faster

const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequestModel;