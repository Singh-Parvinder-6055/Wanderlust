const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    },
});

//using passportLocalMongoose as a plugin. 
//So that passport can automatically add username and passport fields in the userSchema
userSchema.plugin(passportLocalMongoose);
//console.log(typeof passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);