const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Post = require("../Models/Post");
const Like = require("../Models/Like");
const Comment = require("../Models/Comment");
const { postUpload } = require("../utils/cloudinaryStorage");
const Notification=require("../Models/Notification")

const postRouter = express.Router();

postRouter.post(
  "/createpost",
  userAuth,
  postUpload.single("image"),
  async (req, res) => {
    // console.log(req.userData)
    try {
      const authorId = req.userData._id;
      // const { content, image, tags } = req.body;
      console.log(req.body);
      console.log(req.file);
      const { content, tags } = req.body;
      let image;

      if (req?.file) {
        console.log(req?.files?.path);
        image = req?.file?.path;
      }

      const post = new Post({
        author: authorId,
        content,
        image,
        tags,
      });
      const savedPost = await post.save();

      res.json({ message: "Post created Successfully", data: savedPost });
    } catch (err) {
      res.status(400).json({ error: err.message });
      console.log("Inside erro block of createpost api-->", err.message);
    }
  },
);

//GET ALL Posts
postRouter.get("/allpost", userAuth, async (req, res) => {
  try {
    // logged-in user id from auth middleware
    const userId = req.userData._id;

    // fetch all posts
    // populate author details
    // newest posts first
    const allPost = await Post.find()
      .populate("author", "firstName lastName photoUrl")
      .sort({ createdAt: -1 })
      .lean();

    // fetch all likes of current logged-in user
    // example:
    // [
    //   { userId: "abc", postId: "1" },
    //   { userId: "abc", postId: "5" }
    // ]
    const likedPosts = await Like.find({ userId });

    // extract only postIds from liked posts
    // result:
    // ["1", "5"]
    const likedPostIds = likedPosts.map((like) => like.postId.toString());

    // add isLiked field to every post
    // if current post id exists in likedPostIds
    // then isLiked becomes true
    const updatedPosts = allPost.map((post) => ({
      ...post,

      isLiked: likedPostIds.includes(post._id.toString()),
    }));

    // send final updated posts to frontend
    res.json({
      message: "All posts fetched successfully",
      post: updatedPosts,
    });
  } catch (err) {
    // error handling
    res.status(400).json({
      message: "Error while fetching posts",
      error: err.message,
    });
  }
});

//Delete a post
postRouter.delete("/deletepost/:id", userAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userData._id;

    const PostData = await Post.findById(postId);
    if (!PostData) {
      return res.status(404).json({ error: "Post not found" });
    }
    //  check ownership
    if (PostData.author.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post Deleted Successfully" });
  } catch (err) {
    res.status(400).send("Error in Deleting the post", err.message);
  }
});

//get post by id
postRouter.get("/posts/:postId", userAuth, async (req, res) => {
  try {
    const postId = req.params.postId;

    const singlePost = await Post.findById(postId).populate(
      "author",
      "firstName lastName photoUrl",
    );
    console.log(singlePost);

    res.json({ message: "Post Fetched Successfully", data: singlePost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Like a Post,throigh postid(:id)
postRouter.post("/posts/:id/like", userAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const postId = req.params.id;

    const existingLike = await Like.findOne({
      userId,
      postId,
    });

    if (existingLike) {
      return res.status(400).json({
        message: "Already liked",
      });
    }

    await Like.create({ userId, postId });
    // const likedPost = await Like.findOne({ userId, postId }).populate(
    //   "userId postId",
    // );

    const likedPost = await Like.findOne({ userId, postId })
      .populate("userId", "firstName")
      .populate({
        path: "postId",
        populate: {
          path: "author",
          select: "firstName",
        },
      });
      console.log(likedPost)
    // console.log(likedPost.userId.firstName,"liked the post of",likedPost.postId.author.firstName);

    //like notification to user
    if (req.userData._id.toString() != likedPost.postId.author._id.toString()) {
      await Notification.create({
        fromUserId: req.userData._id,

        toUserId: likedPost.postId.author._id,

        type: "like",

        message: `${req.userData.firstName} liked your post`,
      });
      console.log("NOTIFICATION CREATED")
    }else{
    console.log("NOTIFICATION NOT CREATED")}

    // console.log(likedPost.userId.firstName,"liked the post of",likedPost.postId.author.firstName);
    !existingLike &&
      (await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 },
      }));
    res.json({ message: "Post Liked", data: likedPost, isLiked: true });
  } 
  catch (err) {
    console.log("error in post like route",err)
    res.status(400).json({ message: err.message });
  }
});

//Unlike  the post API
postRouter.delete("/posts/:id/unlike", userAuth, async (req, res) => {

  try {

    const userId = req.userData._id;
    const postId = req.params.id;

    const deletedLike = await Like.findOneAndDelete({
      userId,
      postId
    });

    if (!deletedLike) {
      return res.status(400).json({message: "Post already unliked"});
    }

    await Post.findByIdAndUpdate(postId, {
      $inc: { likesCount: -1 },
    });

    res.json({ message: "Post Unliked",isLiked: false});
  }
  catch (err) {
    res.status(400).json({error: err.message});
  }

});
//Comment on Post
postRouter.post("/posts/:postid/addcomment", userAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const postId = req.params.postid;
    const { text } = req.body; //user comment from frontend

    const comment = await Comment.create({ userId, postId, text });
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });
    const populatedComment = await Comment.findById(comment._id).populate(
      "userId",
      "firstName lastName photoUrl",
    );

    res.json({ message: "Comment Added successfully", data: populatedComment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//Get all Comments on a POST
postRouter.get("/posts/:postid/comments", async (req, res) => {
  try {
    const postId = req.params.postid;

    const comments = await Comment.find({ postId })
      .populate("userId", "firstName lastName photoUrl")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.delete("/posts/:postid/deletecomment", userAuth, (req, res) => {});

module.exports = postRouter;
