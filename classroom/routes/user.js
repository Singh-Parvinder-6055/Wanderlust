const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("GET for user");
});

router.get("/:id",(req,res)=>{
    res.send("SHOW for user");
});

module.exports=router;