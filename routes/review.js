const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");

const {isLoggedIn,validateReview, isLoggedInReview}=require("../middleware.js")

const reviewController=require("../controllers/reviews.js");


//Post Route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedInReview,wrapAsync(reviewController.destroyReview));

module.exports=router;
