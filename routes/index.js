const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
/* GET home page. */
router.get(
  "/",
  asyncHandler(async function (req, res, next) {
    const messages = await Message.find().populate("author").exec();
    res.render("index", { messages });
  })
);

// delete message
router.delete(
  "/",
  asyncHandler(async function (req, res, next) {
    await Message.findByIdAndDelete(req.body.id);
    next();
  })
);
module.exports = router;
