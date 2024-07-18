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
    const userdata = await collection.insertMany(data);
    console.log(userdata);
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})