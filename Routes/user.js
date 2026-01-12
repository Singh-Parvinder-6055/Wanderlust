const express=require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../Controller/users.js");

//common route for renderring signup form and create new User
router.route("/signup")
            .get(userController.renderSignupForm)
            .post(wrapAsync(userController.signUpUser));


//common route for renderring login form and Logging the user in
router.route("/login")
            .get(userController.renderLoginForm)

            .post(saveRedirectUrl,//the current session expires and a new session starts after the passport.authenticate()
                passport.authenticate('local',  //the passport.authenticate() internally calls req.login(user)  and passes the user after accessing the user from req.user
                    {failureRedirect:'/login', 
                    failureFlash:true}),

                userController.loginUser);



//logout user route
router.get("/logout",userController.logoutUser);

module.exports=router;