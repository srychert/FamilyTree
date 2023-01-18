const User = require("../../models/User");

const hasRoles = (...roles) => {
	return async (req, res, next) => {
		if (!req.user) {
			res.status(401).end();
			return;
		}

		const user = await User.findById(req.user.id);
		if (roles.includes(user.role)) {
			next();
		} else {
			res.status(403).end();
			return;
		}
	};
};

module.exports = hasRoles;
