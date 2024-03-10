const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Blog = require("./models/blogs.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const multer = require('multer');
const wrapAsync = require("./utils/wrapAsync.js");
const session = require("express-session");


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

const sessionOptions ={
secret: "mysupersecretcode",
resave: false,
saveUninitialized: true,
httpOnly: true,
};

app.get("/", (req, res) => {
    res.send("hi, I am root");
});

app.use(session(sessionOptions));



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

/////////////////          BLOGS         ///////////////////////////////////////////

//Index Route
app.get("/blogs", async (req,res) => {
    const allBlogs = await Blog.find({});
    res.render("blogs/blogs.ejs",{allBlogs});
});


    //new route
app.get("/blogs/new", (req, res) => {
    res.render("blogs/new.ejs");
});

//Show Route
app.get("/blogs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching blog with id:", id);
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        console.log("Found blog:", blog);
        res.render("blogs/show.ejs", { blog });
    } catch (err) {
        console.error("Error fetching blog:", err);
        res.status(500).send("Error fetching blog");
    }
});

// Create Route
app.post("/blogs", upload.single('blogs[image]'), async (req, res, next) => {
    try {
        // Log the received file
        console.log("Received file:", req.file);

        // Check if file exists
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        // Continue with saving the blog entry
        const newBlog = new Blog({
            // Access other fields using req.body.blogs
            title: req.body.blogs.title,
            description: req.body.blogs.description,
            image: req.file.filename, // Save the filename to the database
            date: req.body.blogs.date
        });
        
        await newBlog.save();
        res.redirect("/blogs");
    } catch(err) {
        next(err);
    }
});



//Edit route
app.get("/blogs/:id/edit", async(req,res) => {
    let {id} = req.params;
    const Blog = await Blog.findById(id); // Use Blogs model here
    res.render("blogs/edit.ejs", {Blog}); // Pass 'blog' instead of 'blogs'
});


//Update route
app.put("/blogs/:id", async (req, res) => {
    let {id} = req.params;
    await Blogs.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/blogs");
});

//Delete route
app.delete("/blogs/:id", async (req, res) =>{
    let {id} = req.params;
   let deletedBlog = await Blogs.findByIdAndDelete(id); // Use Blogs model here
   console.log(deletedBlog);
   res.redirect("/blogs/");
});





////////////////////////////////////////////////////////////
//Index Route
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    });

    //new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});





//Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("Listings/show.ejs", {listing});
})

//Create Route
app.post("/listings", upload.single('listing[image]'), async (req, res, next) => {
    try {
        // Log the received file
        console.log("Received file:", req.file);

        // Check if file exists
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        // Continue with saving the listing entry
        const newListing = new Listing({
            // Access other fields using req.body.listing
            title: req.body.listing.title,
            description: req.body.listing.description,
            image: req.file.filename, // Save the filename to the database
            location: req.body.listing.location,
            price: req.body.listing.price
        });

        await newListing.save();
        req.flash("Success", "New Listing created!");
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

//Reviews
//Post route
app.post("/listings/:id/reviews", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("New review saved:", newReview);
        return res.send("New review saved");
    } catch (error) {
        console.error("Error saving review:", error);
        return res.status(500).send("Error saving review: " + error.message);
    }
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

app.get("/blogs", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("blogs/blogs.ejs",{allListings});
    });


/////////////// Add to Cart ////////////////  

app.post("/cart", (req, res) => {
    const { productName, price, image, quantity } = req.body;
    res.redirect(`/cart?productName=${productName}&price=${price}&image=${image}&quantity=${quantity}`);
});


app.get("/cart", (req, res) => {
    const { productName, price, image, quantity } = req.query;
    const listing = {
        title: productName,
        price: price,
        image: image,
        // Add other properties as needed
    };
    res.render("cart/cart", { listing, quantity });
});





app.listen(3000, () =>{
    console.log("Server is listening to port 3000");
});