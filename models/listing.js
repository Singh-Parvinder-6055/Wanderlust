const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
const User=require("./user.js");
// const Review=require("./reviews.js");
let listingSchema= new Schema({
    title:
    {
        type:String,
        required:true
    },
    description:String,
    image:
    {
        type:String,
        default:"https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        set:(v)=>
            v===""?"https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80":v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

//mongoose middleware that will run after executing "findOneAndDelete"/"findByIdAndDelete" command
//and delete all the reviews of a listing after deleting the listing itself
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

let Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;