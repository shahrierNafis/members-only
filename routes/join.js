const router = require("express").Router();
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

router.get("/", (req, res) => {
  res.render("join");
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    console.log(req.body.passcode);
    if (req.body.passcode === process.env.PASSCODE) {
      await User.findByIdAndUpdate(req.user._id, {
        membershipStatus: "member",
      });
      res.redirect("/");
    } else {
      return res.render("join", {
        error: "Wrong!!!",
      });
    }
  })
);

module.exports = router;
