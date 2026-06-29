const socket=require("socket.io");
const crypto=require("crypto");
const { Chat } = require("../Models/Chat");

const getSecretRoomId=(userId,targetUserId)=>{
    return crypto.createHash("sha256").update([userId,targetUserId].sort().join("_")).digest("hex");
} 

const initializeSocket=(server)=>{
    const io=socket(server,{
    cors:{
        origin:"http://localhost:5173",
    }
    });

    io.on("connection",(socket)=>{
        //Handle events(like joinChat,sendmessage,disconnection )
        //the frontend emit event  joinCHat and below will handle it
        //whenever you recieve the event you recieve the same data(useID,targetUserId)emitted from frontend
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            //create room so that 2 user can chat
            // const roomId=[userId,targetUserId].sort().join("_")  //need same unique id
            const roomId=getSecretRoomId(userId,targetUserId)
            console.log(firstName,"Joining room id -->",roomId)
            socket.join(roomId)
        })

        socket.on("sendMessage",async({firstName,lastName,userId,targetUserId,newMessage})=>{
            const roomId=getSecretRoomId(userId,targetUserId)
            console.log(firstName + ":"+newMessage)

            //Saving msg to DB
            try{
                //checking if chat already exist btw two user if exist then new chat push in array of message if not exist then create
                let chat=await Chat.findOne({
                    participants:{$all: [userId,targetUserId] },
                })
                if(!chat){
                    chat=new Chat({
                        participants:[userId,targetUserId],
                        messages:[]
                    })        
                }
                chat.messages.push({
                    senderId:userId,
                    text:newMessage
                })
                 await chat.save()
            }catch(err){
                console.log(err)
            }
            io.to(roomId).emit("messageReceived",{senderId:userId,firstName,lastName,text:newMessage,userId,targetUserId} )
        })

        socket.on("dissconnect",()=>{

        })
    })


  
}

module.exports=initializeSocket