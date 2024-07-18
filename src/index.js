const express = require('express');
const pasth = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();
//Chuyen data sang json
app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.get('/', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

//Register
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    // Ktra xem co trung username:
    const existingUser = await collection.findOne({
        name: data.name
    });

    if (existingUser) {
        res.send("Choose a different username!");
    } else {
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

})

// Login

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({
            name: req.body.username
        });
        if (!check) {
            res.send("Wrong username");
        }
        const isPasswordMatch = await collection.findOne({
            password: req.body.password
        });
        if (isPasswordMatch) {
            res.render("home");
        } else {
            res.send("Wrong password!");
        }
    } catch (error) {
        res.send("Wrong details");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})