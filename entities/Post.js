
const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        required: true,
    },
    body: {
        type: String,
        minlength: 1,
        required: true,
    }
})

const Posts = mongoose.model("posts", postSchema);

module.exports = {
    Posts: Posts
};