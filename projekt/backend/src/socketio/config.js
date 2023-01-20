const passport = require("passport");

const configure = (io, sessionMiddleware) => {
	// convert a connect middleware to a Socket.IO middleware
	const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

	io.use(wrap(sessionMiddleware));
	io.use(wrap(passport.initialize()));
	io.use(wrap(passport.session()));

	// only allow logedIn users
	io.use((socket, next) => {
		if (socket.request.user) {
			next();
		} else {
			next(new Error("unauthorized"));
		}
	});
};

module.exports = { configure };
