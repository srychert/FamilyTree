import { io } from "socket.io-client";
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();

class SocketioService {
	socket;
	constructor() {}

	setupSocketConnection() {
		this.socket = io("http://localhost:5000", {
			withCredentials: true,
		});

		this.socket.on("msg", (data) => {
			console.log(data);
			chatStore.addMsg(data);
		});
	}

	isActive() {
		if (this.socket?.active) {
			return this.socket?.active;
		}

		return false;
	}

	sendMsg(msg) {
		this.socket.emit("msg", msg);
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
		}
	}
}

export default new SocketioService();
