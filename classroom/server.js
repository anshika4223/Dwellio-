const express=require("express");
const app=express();
const user=require("./routes/user.js");
const post=require("./routes/post.js");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

const sessionOptions={
        secret :"mysupersecretstring",
        resave : false,
        saveUninitialized: true,    
};

app.use(session(sessionOptions));
app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use((req,res,next)=>{
    res.locals.successMsg =req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count)
    {
        req.session.count++;
    }
    else{
        req.session.count=1;
    }

    res.send(`You sent a request ${req.session.count} times`);
});

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name === "anonymous")
    {
        req.flash("error","user not registerd!");
    }
    else{
        req.flash("success","user registered successfully!");
    }
    res.redirect("/hello");   
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name : req.session.name});
})

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// })

app.listen(3000,()=>{
    console.log("port is listening at 3000");
})


// app.use(cookieParser("secretcode"));
// const cookieParser = require("cookie-parser");
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");
//     res.send("sent you some cookies!");
// });

// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi, ${name}`);
// })

// app.get("/",(req,res)=>{
//     console.log(req.cookies);
//     res.send("This is a root directory");
// })
// //USERS
// app.use("/users",user);
// //POST
// app.use("/posts",post)