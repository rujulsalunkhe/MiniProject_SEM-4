const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/homebeing";
main().then( () => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
    res.send("hi, I am root");
});

app.get("/testListing", async (req,res) => {
 let sampleListing = new Listing({
    title: "wooden kitchen",
    description: "Thane",
    price : 1200,
    location: "Thane",
   });

   await sampleListing.save();
   console.log("Sample was saved");
   res.send("Successful testing");
});
app.listen(3000, () =>{
    console.log("Server is listening to port 3000");
});