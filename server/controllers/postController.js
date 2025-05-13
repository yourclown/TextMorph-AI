const post = require("../models/post");
const Post = require("../models/post");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("../utils/cloudinaryConfig");

exports.createPost = catchAsync(async (req, res) => {
  const { storyText } = req.body;
  const files = req.files; // Files from multer
  const userId = req.userId;

  if (!storyText || storyText.trim() === "") {
    return res
      .status(400)
      .json({ success: false, error: "Story text is required" });
  }

  // Upload files to Cloudinary
  const mediaUrls = [];
  if (files && files.length > 0) {
    try {
      for (const file of files) {
        // Wrap the upload_stream in a Promise to use await
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: file.mimetype.startsWith("video")
                ? "video"
                : "image",
              folder: "textmorph/posts", // Optional: Organize files in a folder
            },
            (error, result) => {
              if (error) {
                reject(error); // Reject the Promise on error
              } else {
                resolve(result); // Resolve the Promise with the result
              }
            }
          );
          // Important: Pipe the file buffer to the upload stream
          uploadStream.end(file.buffer);
        });
        mediaUrls.push(result.secure_url);
      }
    } catch (error) {
      // Handle any errors that occurred during the upload process
      console.error("Cloudinary upload error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to upload media files" }); //send error response
    }
  }

  const post = await Post.create({
    storyText,
    mediaUrls,
    userId,
  });
  res.status(201).json({ success: true, post });
});

exports.getPosts = catchAsync(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("userId", "email");
  res.status(200).json({ success: true, posts });
});

exports.myprofile = catchAsync(async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  const profile = await Post.find({ userId: userId })
    .sort({ createdAt: -1 })
    .populate("userId", "email")
    .populate("comments.userId", "email");
  console.log(profile);

  if (!profile) {
    return res.status(404).json({ success: false, error: "No post yet!! " });
  }

  res.status(200).json({ success: true, profile });
});

exports.likePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, error: "Post not found" });
  }
  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }
  await post.save();
  res.status(200).json({ success: true, likes: post.likes.length });
});

exports.commentOnPost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res
      .status(400)
      .json({ success: false, error: "Comment text is required" });
  }
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, error: "Post not found" });
  }
  post.comments.push({ userId, text });
  await post.save();
  res.status(200).json({ success: true, comments: post.comments });
});
