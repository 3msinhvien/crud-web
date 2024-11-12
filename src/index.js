const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const collection = require("./config");
const postService = require("../controllers/postService");

const app = express();

// Cấu hình session
app.use(session({
    secret: 'your-secret-key',  // Chuỗi bí mật cần bảo mật
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 } // Session tồn tại trong 30 phút
}));

// Cấu hình để vô hiệu hóa cache và duy trì session
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
});

// Chuyển dữ liệu sang JSON và xử lý dữ liệu từ form
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cấu hình view engine và thư mục tĩnh
app.set("view engine", "ejs");
app.use(express.static("public"));

// Route hiển thị trang chính
app.get("/", (req, res) => {
    if (req.session.username) {
        if (req.session.username === "admin") {
            res.render("admin-home");
        } else {
            res.render("home");
        }
    } else {
        res.render("login");
    }
});

// Route đăng ký
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Route tạo bài viết
app.get("/create-post", (req, res) => {
    res.render("create-post");
});

// Xử lý đăng ký người dùng
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
    };
    const existingUser = await collection.users.findOne({ name: data.name });

    if (existingUser) {
        res.send("Choose a different username!");
    } else {
        await collection.users.insertMany(data);
        res.redirect("/");
    }
});

// Xử lý đăng nhập
app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (username === "admin") {
            const adminUser = await collection.users.findOne({ name: username, password: password });
            if (adminUser) {
                req.session.username = username;
                res.render("admin-home");
            } else {
                res.send("Wrong password for admin");
            }
        } else {
            const user = await collection.users.findOne({ name: username, password: password });
            if (user) {
                req.session.username = username;
                res.render("home");
            } else {
                res.send("Wrong username or password!");
            }
        }
    } catch (error) {
        res.send("Error during login");
        console.log(error);
    }
});

// Xử lý đăng xuất
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error logging out:", err);
            res.send("Error logging out");
        } else {
            res.redirect("/");
        }
    });
});

// Tạo bài viết mới
app.post("/create-post", async (req, res) => {
    const data = {
        title: req.body.title,
        content: req.body.content,
    };
    if (req.session.username) {
        await collection.posts.insertMany(data);
        res.redirect("/post-list");
    } else {
        res.send("Please login first");
    }
});

// Hiển thị danh sách bài viết
app.get("/post-list", async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.render("post-list", { posts: posts });
    } catch (error) {
        console.error("Error rendering post list:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Hiển thị form chỉnh sửa bài viết
app.get("/edit-post/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await collection.posts.findById(postId).lean();
        if (post) {
            res.render("edit-post", { post: post });
        } else {
            res.status(404).send("Post not found");
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Xử lý cập nhật bài viết
app.post("/edit-post/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;
        
        await collection.posts.findByIdAndUpdate(postId, { title, content });
        res.redirect("/post-list"); // Chuyển về trang danh sách bài viết sau khi cập nhật
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Hiển thị danh sách người dùng (chỉ dành cho admin)
app.get("/user-list", async (req, res) => {
    try {
        if (req.session.username === "admin") {
            const users = await collection.users.find({}).lean();
            res.render("user-list", { users: users });
        } else {
            res.send("Access denied! Only admin can view this page.");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Chạy server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
