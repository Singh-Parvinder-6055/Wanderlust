const Listing=require("../models/listing");
const maptilerClient = require('@maptiler/client');


module.exports.index=async(req,res)=> {
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing=async(req,res,next)=>{
       

        // Set your API Key
        maptilerClient.config.apiKey = process.env.MAP_TOKEN;

        // Example of how to use it for Geocoding in your route:
        const result = await maptilerClient.geocoding.forward(req.body.listing.location);
        //console.log(result.features[0].geometry);
        

        let newListing= new Listing(req.body.listing); 
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={filename,url};
        newListing.owner=req.user._id; 
        newListing.geometry=result.features[0].geometry;
        let savedListing= await newListing.save();
        console.log(savedListing);
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
module.exports.searchByCategory=async(req,res)=>{
    let {category}=req.query;
    let allListings=await Listing.find({category:category});
    if(!allListings.length){
        req.flash("success","No listings found in this category");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings});
};

module.exports.findByLocation=async(req,res)=>{
    let {location}=req.body;
    let allListings=await Listing.find({location:location});
    if(!allListings.length){
        req.flash("success","No listings found at this location");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings});

}
module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for is not found");
        return res.redirect("/listings");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/c_fill,h_150,w_150");
    
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};


module.exports.updateListing=async(req,res)=>{
    //console.log("api worked");
    let{id}=req.params;  
    
    let updatedListing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if( typeof req.file!= "undefined"){        
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={filename,url};
        await updatedListing.save();
    }

    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing= async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
};