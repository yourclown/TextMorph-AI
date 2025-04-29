const express = require("express");
const auth = require("../middleware/authmiddleware");
const { transformText ,getHistory } = require("../controllers/promptController");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.post("/transform", auth, catchAsync( transformText));
router.get("/storyList", auth, catchAsync( getHistory));



module.exports = router;