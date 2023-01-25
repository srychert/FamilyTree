const Message = require("../models/Message");

const handel = (io) => {
	io.on("connect", (socket) => {
		console.log(`new connection ${socket.id}`);

		socket.on("join", (room) => {
			socket.join(room);
			socket.room = room;
		});

		socket.on("msg", async (msg) => {
			try {
				const msgToSave = await Message.create({
					content: msg.content,
					to: msg.to,
					from: msg.from,
					dateSend: new Date(),
				});

				switch (msg.to) {
					case "all":
						io.emit("all", msgToSave);
						break;

					default:
						io.in(socket.room).emit("private", { ...msgToSave._doc, room: socket.room });
						break;
				}
			} catch (e) {
				console.log(e.message);
				io.to(session.socketId).emit("error", `error: ${e.message}`);
			}
		});

		const session = socket.request.session;
		console.log(`saving sid ${socket.id} in session ${session.id}`);
		session.socketId = socket.id;
		session.save();
	});
};

module.exports = { handel };
