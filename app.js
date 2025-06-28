if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override"); 
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport =require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

const sessionOptions={
    secret:"my secret code",
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httponly: true,
    },
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg= req.flash("success");
    res.locals.errorMsg= req.flash("error");
    res.locals.currUser=req.user;
    res.locals.redirectUrl=req.session.redirectUrl;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email: "studentManit@gmail.com",
//         username: "anshika",
//     });

//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

//Listings
app.use("/listings",listingRouter);

//Reviews
app.use("/listings/:id/reviews",reviewRouter);

//user
app.use("/",userRouter);

app.get("/",(req,res)=>{
    res.send("This is home root.")
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("listing/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})


// app.get("/testListing",async(req,res)=>{
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"In the heart of Waterfall",
//         price: 5000,
//         location:"Ponduchery",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log(sampleListing);
//     console.log("sample was saved");
//     res.send("successful testing");
// })