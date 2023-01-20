const handel = (io) => {
	io.on("connect", (socket) => {
		console.log(`new connection ${socket.id}`);

		socket.on("msg", (msg) => {
			console.log(msg);
			io.emit("msg", `${socket.request.user.login}: ${msg}`);
		});

		const session = socket.request.session;
		console.log(`saving sid ${socket.id} in session ${session.id}`);
		session.socketId = socket.id;
		session.save();
	});
};

module.exports = { handel };
