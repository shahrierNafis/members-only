const router = require("express").Router();

/* GET sign-out page. */
router.get("/", function (req, res, next) {
  res.render("sign-out");
});
/* POST sign-out page. */
router.post("/", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
