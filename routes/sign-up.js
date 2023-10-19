const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("sign-up");
});

router.post("/", [
  // validate and sanitize inputs
  body("name", "Name is required").isLength({ min: 1 }).escape(),
  body("password", "Password is required").isLength({ min: 1 }),
  body("email", "Email is required")
    .isLength({ min: 1 })
    .isEmail()
    .withMessage("Invalid email")
    .escape(),
  body("confirmPassword")
    .exists()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
  asyncHandler(async (req, res) => {
    // get validation errors
    const errors = validationResult(req);

    // make a user
    const { name, password, email } = req.body;
    const user = new User({
      name,
      password: await bcrypt.hashSync(password, 10),
      email,
      membershipStatus: "nonMember",
    });
    if (errors.isEmpty()) {
      // no error, save user
      await user.save();
      // redirect to index
      res.redirect("/");
    } else {
      // errors, render sign-up page with errors
      return res.render("sign-up", {
        errors: errors.array(),
        name: name,
        password: password,
        email: email,
      });
    }
  }),
]);

module.exports = router;
