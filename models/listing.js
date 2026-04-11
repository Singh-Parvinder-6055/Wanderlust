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
        filename:String,
        url:String,
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
    },
    geometry:{
        type: {
        type: String,
        enum: ['Point'],
        required: true
        },
        coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
        }
        }
});

//mongoose middleware that will run after executing "findOneAndDelete"/"findByIdAndDelete" command on Listing model
//and will delete all the reviews of a listing after deleting the listing itself
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

let Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;