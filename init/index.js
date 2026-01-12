const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

async function Main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

Main().then(()=>{console.log("connected to database");}).catch(err=>{console.log(err);});

//console.log(initData);
let initDB=async ()=>{
    await Listing.deleteMany({});
    //let owner="6958eb39cfed41420435c065";
    initData.data=initData.data.map((el)=>({...el, owner:"6958eb39cfed41420435c065"}));
    await Listing.insertMany(initData.data);
    console.log("Database inittialized successfully");
};

initDB();