const validation=(req)=>{
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter the Name please")
    }
    
}

module.exports={
    validation
}