const User=require("../models/user");



module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUpUser=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        let newUser= new User({username,email});
        let registeredUser= await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{ //this method is used to login a user afer a successfull signup
            if(err){                        //It takes the registeredUuser & a callback function as arguments
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect(`/listings`);
        });    
      }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }   
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginUser=async(req,res)=>{
                req.flash("success","Welcome back to Wanderlust");
                
                let redirectUrl=res.locals.redirectUrl ||"/listings"; //now after the login, the users will be redirected to the original path they tried to access instead of the all listings
                res.redirect(redirectUrl);
            };

module.exports.logoutUser=(req,res)=>{
    req.logout((err)=>{
        if(err){    
            next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
};