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
		return res.status(200).send({
			id: req.user._id,
			login: req.user.login,
			registrationDate: req.user.registrationDate,
			role: req.user.role
		});
	}
);

module.exports = router;
