const express=require("express");
const router=express.Router({mergeParams:true});//mergeParams is used to merge the parent and child parameters
const Review=require("../models/reviews.js")  //required review model
const{reviewSchema}=require("../schema.js");  //required server side Joi review validation schema
const wrapAsync=require("../utils/wrapAsync.js");  //required wrap async to handle any asynchronous error
const Listing=require("../models/listing.js");  //reqired listing model
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedInForReviews,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../Controller/reviews.js");


//Middleware to validate review before saving into database
const validateReview=(req,res,next)=>{
    console.log("Review validation done");
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//review submit route
router.post("/",isLoggedInForReviews,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedInForReviews,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;