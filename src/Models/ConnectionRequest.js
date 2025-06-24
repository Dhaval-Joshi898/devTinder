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
            message:`{values} is not the correct status,not acceptale`
        }
    }
  },
  { timestamps: true }
);

const ConnectionRequestModel=mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequestModel;