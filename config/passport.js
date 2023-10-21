const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const passport = require("passport");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, {
          message: "user with that email does not exist",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user, {
          message: "logged in successfully",
        });
      }
      return done(null, false, {
        message: "incorrect password",
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  return done(null, user);
});

module.exports = passport;
