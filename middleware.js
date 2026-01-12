const Listing= require("./models/listing.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
      
            req.session.redirectUrl=req.originalUrl; //storing the original url in the session because locals do not persist accross redierect(i.e. they remain only for a single request)
            req.flash("error","You Must be logged in to make any changes!");
            return res.redirect("/login"); 
        
    }
    next();
};

//in the login route, this middleware runs before the passport.authenticate() and the session's info is reset after passport.authenticate (i.e. the current session expires and new one starts)
//so before the session gets reset, we will store the value of req.session.redirectUrl into the res.locals.redirect
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; 
        //console.log(req.originalUrl);
        
    }
    next();
};


//this is to check if a user wants to make changes in a listing, he is the owner of the particular listing
module.exports.isOwner= async(req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    let owner=res.locals.currUser;
    if(!(owner && listing.owner._id.equals(owner._id))){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
            let{id,reviewId}= req.params;
            let review=await Review.findById(reviewId);
            let currUser= res.locals.currUser;
                if(!(currUser && review.author._id.equals(currUser._id))){
                    req.flash("error","You are not the author of this review");
                    return res.redirect(`/listings/${id}`);
                }
                next();
};


//we made separate isLoggedIn middleware for the reviews
//because, when a review is submitted or deleted, they send a request to a path
//but we don't have a separate ejs template for them.
//so if we use the value of req.originalUrl, then the server will redirect us on a page that doesnt even exit
// therefore, we created this middleware which redirect again to the show route after login.
module.exports.isLoggedInForReviews=async(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        let{id}=req.params;
        req.session.redirectUrl=`/listings/${id}`;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
};
