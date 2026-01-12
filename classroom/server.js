const express=require("express");
const app= express();
const user=require("./routes/user.js");
//const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

const sessionOptions={
    secret:"mysecret", //weak secret
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
// app.use(cookieParser);
app.use(flash());


//when the control is passed to "/hello" route, this middleware extracts
//the value of message if it exists
app.use((req,res,next)=>{
    res.locals.errorMsg=req.flash('error');
    res.locals.successMsg=req.flash('success');
    next();
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.get("/",(req,res)=>{
    console.log("Response received on root");
    res.send("Hi, I am root");

});

app.get("/get",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }
    res.send(`You sent a request ${req.session.count} times.`);
    console.log(req.session);
});

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;    
    if(name=="anonymous"){
        req.flash("error","User not registered");       
    }
    else{
         req.flash("success","user registered successfully");
    }
    
    res.redirect("/hello");
});
app.get("/hello",(req,res)=>{
    
    //let msg=req.flash('success');
    // res.locals.successMsg=req.flash("success")
    res.render("show.ejs",{name: req.session.name });

});

app.listen(3000,()=>{
    console.log("Listening on port 3000");
});
