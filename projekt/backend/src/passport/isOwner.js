const User = require("../models/User");

const isOwner = async (req, res, next) => {
	if (!req.user) {
		res.status(401).end();
		return;
	}

	const user = await User.findById(req.user.id);
	if (req.params.userId === user.id || user.role === "ADMIN") {
		next();
	} else {
		res.status(403).end();
		return;
	}
};

module.exports = isOwner;
