const mongoose=require("mongoose");


const likeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId ,ref:"User"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId ,ref:"Post"
    }
} ,{timestamps:true})

//Prevent Duplicate Likes
// "Group these together": Create a shortcut (index) that tracks the combination of userId and postId.
// "Keep it unique": Make sure no two documents have the exact same pair of IDs
likeSchema.index({userId:1,postId:1}, {unique:true});

module.exports=mongoose.model("Like",likeSchema);