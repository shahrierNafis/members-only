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

module.exports = router;
