const express = require('express');
const pasth = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");
const postService = require("../controllers/postService");
const { log } = require('console');

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
app.get('/create-post', (req, res) => {
    res.render("create-post");
});
app.get('/post-list', (req, res) => {
    res.render("post-list");
});


//Register
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    // Ktra xem co trung username:
    const existingUser = await collection.users.findOne({
        name: data.name
    });

    if (existingUser) {
        res.send("Choose a different username!");
    } else {
        const userdata = await collection.users.insertMany(data);
        console.log(userdata);
    }

})

// Login

var loginSuccess = true;

app.post("/login", async (req, res) => {
    try {
        if (req.body.username == 'admin') {
            const isPasswordMatch = await collection.users.findOne({
                password: req.body.password
            });
            if (isPasswordMatch) {
                res.render("admin-home");
            } else {
                res.send("wrong password");
            }
        } else {
            const check = await collection.users.findOne({
                name: req.body.username
            });
            if (!check) {
                res.send("Wrong username");
            }
            const isPasswordMatch = await collection.users.findOne({
                password: req.body.password
            });
            if (isPasswordMatch) {
                res.render("home");
                loginSuccess = true;
            } else {
                res.send("Wrong password!");
            }
        }
    } catch (error) {
        res.send("Wrong details");
        console.log(error)
    }
});

// Post

if (loginSuccess === true) {
    app.post('/create-post', async (req, res) => {
        const data = {
            title: req.body.title,
            content: req.body.content
        }
        const userdata = await collection.posts.insertMany(data);
        console.log("Success");
    });

}
//Show bai viet ra man hinh
app.get('/post-list', async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        console.log("Posts received in route handler:", posts);
        res.render("post-list", { posts: posts });
    } catch (error) {
        console.error("Error rendering post list:", error);
        res.status(500).send("Internal Server Error");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})