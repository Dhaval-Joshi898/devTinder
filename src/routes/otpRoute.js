const express = require("express");
const otpRouter = express.Router();
const OTP = require("../Models/Otp");
const User = require("../Models/user");

const sendEmail = require("../utils/sendEmail");

otpRouter.post("/sendotp", async(req,res)=>{

    try{

        const {emailId} = req.body;

        if(!emailId){
            throw new Error("Email is required");
        }

        const existingUser = await User.findOne({emailId});

        if(existingUser){
            throw new Error("User already exists");
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        await OTP.deleteMany({emailId});

        await OTP.create({
            email:emailId,
            otp,
            expiresAt:new Date(Date.now() + 5*60*1000)
        });

        await sendEmail(emailId,otp)
        res.json({
            message:"OTP sent successfully",
        });

    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }

})

module.exports = otpRouter;