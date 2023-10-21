const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");

require("dotenv").config();

const app = express();

// database connection
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .catch((error) => require("debug")("DB connection error")(error));
mongoose.connection.on("error", (err) => {
  require("debug")("DB connection error")(err);
});

// session store
const MongoStore = require("connect-mongo");
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "sessions",
});

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 400 * 24 * 60 * 60 * 1000, // 400 days
    },
  })
);

// Passport configuration
const passport = require("./config/passport");
app.use(passport.session());
app.use(passport.initialize());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  // console.log("req.user:", req.user);
  res.locals.user = req.user;
  next();
});

app.use("/", require("./routes"));
app.use("/sign-up", require("./routes/sign-up"));
app.use("/sign-in", require("./routes/sign-in"));
app.use("/sign-out", require("./routes/sign-out"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
