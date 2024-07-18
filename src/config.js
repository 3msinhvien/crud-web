const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login");

connect.then(() =>{
    console.log("Database connected Success");
})
.catch(() => {
    console.log("Database can't connected");
});

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model("user", loginSchema);

module.exports = collection;