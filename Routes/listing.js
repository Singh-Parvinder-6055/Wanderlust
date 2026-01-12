const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");  //reqired listing model
const wrapAsync=require("../utils/wrapAsync.js");  //required wrap async to handle any asynchronous error
const{listingSchema}=require("../schema.js");  // required server side Joi listing validaton schema 
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn, isOwner}=require("../middleware.js");// to check the owner of listing
                                                        //to check if the user is logged-in
const listingController=require("../Controller/listings.js");//to use the callbacks for listing route




//server side validation of newly created  listing using JOI 
const validateListing= (req,res,next)=>{
    console.log("Listing validation done");
    let {error}=listingSchema.validate(req.body);
    //console.log(result);
    if(error){
    let errMsg=error.details.map(el=>el.message).join(",");
    console.log(errMsg);
    
        throw new ExpressError(400,errMsg);
    }
    else{
    next();
    }
};


//common route to see all listings and create new one
router.route("/")
        .get(wrapAsync(listingController.index))   //to see all listings
        .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing)); //submit new listing on this route



//rendering a from to create  new listing
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


//common route for show, update and destroy listing
router.route("/:id")
         .get(wrapAsync(listingController.showListing))   //show route,to see a particular listing
         .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))  //submit the edited listing on this route
         .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));   //delete a listing


//to edit an existing listing
//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;