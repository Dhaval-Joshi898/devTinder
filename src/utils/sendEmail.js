const nodemailer=require("nodemailer")
const { default: isEmail } = require("validator/lib/isEmail")

const sendEmail=async (email,otp)=>{

    const transporter=nodemailer.createTransport({
        service:"gmail",

        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:"DevTinder OTP verification",
        html:`
            <h2>Welcome to DevTinder</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP will expire in 5 minutes.</p>
        `
    }
    await transporter.sendMail(mailOptions)

}

module.exports=sendEmail;