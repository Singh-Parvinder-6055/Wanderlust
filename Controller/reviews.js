const Listing=require("../models/listing");
const Review=require("../models/reviews");


module.exports.createReview=async(req,res)=>{
    // let {id}=req.params;
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    //console.log(review._id);
    let listing= await Listing.findById(req.params.id);
    //console.log(listing);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("review submitted successfully");
    req.flash("success","Review added Successfully");
    res.redirect(`/listings/${req.params.id}`);
};


module.exports.destroyReview=async (req,res)=>{
    let{id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};