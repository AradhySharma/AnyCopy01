const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    full_name:{
         type:String,
         required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,

    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    CompanyName:{
         type:String,
         required:true
    },
    Company_Website:{
         type:String,
         required:true
    },
    Industry:{
        type:String,
        required:true
   },
   Bussiness_Size:{
        type:String,
        required:true
    },
    Products:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
   },   
    Audience:{
        type:String,
        required:true
    },
    Keywords:{
        type:String,
        required:true
    },
    verificationCode: {
        type: String,
        //required: true
    }
},

)

module.exports = mongoose.model("User", UserSchema);