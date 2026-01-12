const express=require("express");  
const app=express();
const mongoose=require("mongoose");   // requiring mongoose to connect with mongodb
const path=require("path");  
const methodOverride=require("method-override");   //using method override in forms to send put, patch, delete requests
const ejsMate=require("ejs-mate");  //required ejs mate to set a single boilderplate code for entire application
const ExpressError=require("./utils/ExpressError.js");  //required custom ExpressError class
const listingsRouter=require("./Routes/listing.js");
const reviewsRouter=require("./Routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const usersRouter=require("./Routes/user.js")

const sessionOptions={
    secret:"mySecret", //very weak secret
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //this is used for authentication, If we don't use it user won't be authenticated during login
passport.serializeUser(User.serializeUser()); //to store user's info in the session, this is automatically used by the passport
passport.deserializeUser(User.deserializeUser());//to delete user's info from the session, this is automatically used by the passport 

//middleware for extracting flash message from req.flash and inserting it into locals.
//These locals are accessible in all the templates in views directory. Note:- locals remain only for single request
app.use((req,res,next)=>{
    
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; // this currUser object is being use in show.ejs for showing edit & delete buttons to the actual owners
                                    //also in the navbar.ejs to show only login and signup if the user is not logged-in
    //console.log(res.locals.redirectUrl);
    next();
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //to see the data sent in the body of request 
app.use(express.json());
app.use(methodOverride('_method'));//to use delete,put & patch methods using forms
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate); //for using the boilerplate approach

app.listen(8080,()=>{
    console.log("Listening on port 8080");
});

 async function Main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

Main().then(()=>{console.log("connected to database");}).catch(err=>{console.log(err);});

app.get("/",(req,res)=>{
    res.send("I am root");
});

//register a demo user 
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"demo@gmail.com",
//         username:"sigma-student",
//     });

//     let registeredUser= await User.register(fakeUser, "hello");
//     res.send(registeredUser);
// });


app.use("/listings",listingsRouter);//this is parent route. Child route is in the Routes --> listing.js
app.use("/listings/:id/reviews",reviewsRouter);//this is parent route. Child route is in the Routes --> review.js
app.use("/",usersRouter);


//this works for all requests. 
//if any route matched above, this would not be executed
//if no route matched above, this would be executed

//the following function crashes our server due to *
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found!"));
// });

//so here we have handled it using a middleware
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});


//error handling middleware
app.use((err,req,res,next)=>{
    //console.log("newError");
    //res.send("Error");
    let{status=500,message="Something went wrong"}=err;
    
    res.status(status).render("listings/error.ejs",{message});
    
    //next(err.message);
});