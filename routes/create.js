const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");

router.get("/", (req, res) => {
  if (req.user) {
    return res.render("create");
  }
  return res.redirect("/sign-in");
});

router.post("/", [
  // validate and sanitize inputs
  body("title", "Title must be at least 3 characters")
    .isLength({ min: 3 })
    .escape(),
  body("message", "message is required").isLength({ min: 1 }),
  asyncHandler(async (req, res) => {
    // get validation errors
    const errors = validationResult(req);

    // make a message
    const { title, message } = req.body;
    messageInstance = new Message({
      title,
      message,
      author: req.user._id,
    });
    if (errors.isEmpty()) {
      await messageInstance.save();
      res.redirect("/");
    } else {
      return res.render("create", {
        title,
        message,
        errors: errors.array(),
      });
    }
  }),
]);

module.exports = router;
