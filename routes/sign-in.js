const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const passport = require("passport");

// Route handlers
router.get("/", (req, res) => {
  res.render("sign-in");
});

router.post("/", [
  asyncHandler(async (req, res, next) => {
    // get validation errors
    const errors = validationResult(req);
    passport.authenticate("local", function (err, user, info) {
      if (err) return res.status(500).send();
      if (!user) {
        return res.render("sign-in", {
          email: req.body.email,
          error: info.message,
        });
      }
      req.logIn(user, function (err) {
        if (err) return next(err);
        return res.redirect("/");
      });
    })(req, res, next);
  }),
]);

module.exports = router;
