const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const multer = require('multer');


const MONGO_URL="mongodb+srv://atharva:home@cluster0.uddossk.mongodb.net/";
main().then( () => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("hi, I am root");
});

//Index Route
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    });

    //new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


////////////// Upload Image (Multer) ///////////////////

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/') // specify the destination directory for uploads
    },
    filename: function (req, file, cb) {
      // specify the filename for uploaded files
      cb(null, Date.now() + '-' + file.originalname)
    }
  });
  
  const upload = multer({ storage: storage });


//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/show.ejs", {listing});
})

//Create Route
app.post("/listings",upload.single('listing[image]'), async (req, res, next) => {
try{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
} catch(err) {
    next(err);
}
});

//Edit route
app.get("/listings/:id/edit", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

//Delete route
app.delete("/listings/:id", async (req, res) =>{
    let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id)
   console.log(deletedListing);
   res.redirect("/listings/");
});
// app.get("/testListing", async (req,res) => {
//  let sampleListing = new Listing({
//     title: "wooden kitchen",
//     description: "Thane",
//     price : 1200,
//     location: "Thane",
//    });

//    await sampleListing.save();
//    console.log("Sample was saved");
//    res.send("Successful testing");
// });

app.use((err, req, res, next) =>{
    res.send("Something went Wrong!");
});





//////////////// Home Page //////////////////

app.get("/home", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("home/home.ejs",{allListings});
    });

app.use("/Img_files", express.static('Img_files'));

//////////////// Login & Signup Page //////////////////

app.get("/login", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("login/login", { allListings });

});

app.get("/signup", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("login/signup", { allListings });

});



  


app.listen(3000, () =>{
    console.log("Server is listening to port 3000");
});