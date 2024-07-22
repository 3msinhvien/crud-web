const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

connect.then(() => {
    console.log("Database connected Success");
})
.catch(() => {
    console.log("Database cannot be connected!");
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type:String, 
        required: true
    }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

collection = {
    users: new mongoose.model("users", LoginSchema),
    posts: new mongoose.model("posts", postSchema)
    };

module.exports = collection;