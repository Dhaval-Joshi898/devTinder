const multer=require("multer");

const {CloudinaryStorage}=require("multer-storage-cloudinary");

const cloudinary=require("./cloudinary")

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,

    params:{
        folder:"devTinderProfiles",

        allowed_formats:["jpg", "png", "jpeg", "webp"],
    }, 
})

const upload=multer({storage})

const postStorage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"devTinderPosts",
        allowed_formats:["jpg", "png", "jpeg", "webp","avif"],
    }
})

const postUpload=multer({
    storage:postStorage  
})

module.exports={
    upload,
    postUpload
};