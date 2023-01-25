const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const hasRoles = require("../passport/hasRoles");

router.get("/", hasRoles("ADMIN", "USER"), async (req, res) => {
	try {
		const messages = await Message.find({ to: "all" });
		return res.send(messages);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

router.get("/:userLogin", hasRoles("ADMIN", "USER"), async (req, res) => {
	try {
		const logins = [req.params.userLogin, req.user.login];
		const messages = await Message.find({ to: { $in: logins }, from: { $in: logins } });
		return res.send(messages);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

module.exports = router;
