const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: String,
    price: Number,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    category: {
        type:String,
        enum: ["LivingRoom" , "Kitchen"]
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;