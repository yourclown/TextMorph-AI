const express = require("express");
const auth = require("../middleware/authmiddleware");
const catchAsync = require("../utils/catchAsync");
const { createEvent, getEvents, createEventOrder, verifyEventPayment, getMyEvents } = require("../controllers/eventController");

const router = express.Router();

router.post("/", auth, catchAsync(createEvent));
router.get("/",auth, catchAsync(getEvents));
router.get("/my-events", auth, catchAsync(getMyEvents));
router.post("/payment/create-order", auth, catchAsync(createEventOrder));
router.post("/payment/verify-payment", auth, catchAsync(verifyEventPayment));

module.exports = router;