const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
	"/login",
	passport.authenticate("json", { failWithError: true }),
	// handle error
	function (_err, _req, res, _next) {
		return res.status(401).send();
	},
	function (req, res, _next) {
		return res.status(200).send({ id: req.user._id });
	}
);

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

module.exports = router;
