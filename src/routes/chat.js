const express=require("express")
const { userAuth } = require("../middlewares/userAuth")
const { Chat } = require("../Models/Chat")

const chatRouter=express.Router()


chatRouter.get("/chat/:targetUserId",userAuth,async (req,res)=>{
    const {targetUserId}=req.params
    const userId=req.userData._id

    let chat=await Chat.findOne({
        participants:{$all:[userId,targetUserId]}
    }).populate({
        path:"messages.senderId", 
        select:"firstName lastName"
    })
    if(!chat){
        chat=new Chat({
            participants:[userId,targetUserId],
            messages:[]
        })
    }

    return res.json(chat)
})

module.exports=chatRouter