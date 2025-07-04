const express=require("express");
const router=express.Router();

//Index
router.get("/",(req,res)=>{
    res.send("GET for users");
})
//show
router.get("/:id",(req,res)=>{
    res.send("GET for users id");
})
//POST
router.post("/",(req,res)=>{
    res.send("POST for users");
})
//DELETE
router.delete("/:id",(req,res)=>{
    res.send("DELETE for users id");
})

module.exports=router;