const express = require("express");
const {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
  myprofile,
} = require("../controllers/postController");
const auth = require("../middleware/authmiddleware");
const Post = require("../models/post");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/webm"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, MP4, WebM allowed."));
    }
  },
});

router.post("/", auth, upload.array("media", 5), createPost);
router.get("/", getPosts);
router.post("/:id/like", auth, likePost);
router.post("/:id/comment", auth, commentOnPost);
router.get("/me", auth, myprofile);

module.exports = router;
