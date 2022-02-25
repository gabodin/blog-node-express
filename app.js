const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const { redirect } = require("express/lib/response");
const _ = require('lodash');
const {Posts} = require("./entities/Post");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/blogDB");


app.get("/", async function(req, res) {
  try {
    const posts = await Posts.find();
    res.render("home", {posts: posts});
  }
  catch(err) {
    console.log(err.message);
    res.render("not-found", {postTitle: "posts"});
  }
});

app.get("/posts/:postTitle", async function(req, res) {
  const postTitle = _.lowerCase(req.params.postTitle);
  console.log(postTitle);
  const foundPosts = await Posts.find({title: postTitle});

  console.log(foundPosts);
  if(foundPosts.length !==  0) {
    res.render("post", {posts: foundPosts})
  }
  else res.render("not-found", {postTitle: postTitle});

  
});

app.get("/details/:postId", async function(req, res) {
  const postId = req.params.postId;
  
  try {
    Posts.findOne({_id: postId}, function(err, foundPost) {

      res.render("postDetails", {post: foundPost});
    })
  } catch(err) {
    console.log(err.message);
    res.render("not-found", {postTitle: "posts"});
  }

});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose", {});
});

app.post("/compose", async function(req, res) {
  const postTitle = _.lowerCase(req.body.postTitle);
  const postBody  = req.body.postContent;

  const post = new Posts({
    title: postTitle,
    body: postBody
  });

  try {
    const savedPost = await post.save();
    console.log(savedPost);
    res.redirect("/");
  } 
  catch(err) {
    console.log(err.message);
    res.render("not-found", {postTitle: "posts"});
  } 
  
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
