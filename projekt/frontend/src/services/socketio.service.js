import { io } from "socket.io-client";
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();

class SocketioService {
	socket;
	constructor() {}

	setupSocketConnection() {
		this.socket = io(import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:5000", {
			withCredentials: true,
		});

		const listener = (eventName, ...args) => {
			// console.log(eventName, args);
			console.log(args[0]);
			chatStore.addMsg(args[0]);
		};

		this.socket.onAny(listener);
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
