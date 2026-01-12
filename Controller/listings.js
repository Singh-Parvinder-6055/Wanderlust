const Listing=require("../models/listing");



module.exports.index=async(req,res)=> {
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing=async(req,res,next)=>{

        let newListing= new Listing(req.body.listing); 
        newListing.owner=req.user._id; 
        await newListing.save();
        req.flash("success","Listing Saved Successfully");//always put the flash message before the res.redirect
        res.redirect("listings");
        
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews",
         populate:{
            path:"author"
        }
        })
         .populate("owner");
    if(!listing){
        req.flash("error","The listing you requested for is not found")
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    
};


module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for is not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};


module.exports.updateListing=async(req,res)=>{
    //console.log("api worked");
    let{id}=req.params;  
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true});
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing= async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
};