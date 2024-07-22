const collection = require("../src/config");

async function getAllPosts() {
    console.log("ABCD");
    try {
        const posts = await collection.posts.find({}).lean();
        
        return posts;
        
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

module.exports = {
    getAllPosts
};