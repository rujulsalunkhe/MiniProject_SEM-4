const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        type:String,
        set: (v) => v == "" ? "default link" : v,
    },
    price: Number,
    location: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;