const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogsSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: String,
    date:String,
});

const Blog = mongoose.model("Blog", blogsSchema);
module.exports = Blog;