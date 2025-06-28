const Listing=require("../models/listing.js");
const mongoose=require("mongoose");
const initData=require("./data.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
         ...obj,owner :'67bdd93f3255bf85ec2768a3',
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();