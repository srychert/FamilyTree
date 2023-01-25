import { defineStore } from "pinia";
import api from "../api";

export const useChatStore = defineStore("chat", {
	state: () => ({
		chat: {
			all: [],
		},
	}),

	actions: {
		async addMsg(msg) {
			const room = msg.room;
			if (room) {
				this.chat[msg.room] ? this.chat[msg.room].unshift(msg) : (this.chat[msg.room] = []);
				return;
			}

			this.chat.all.unshift(msg);
		},
		async getAll() {
			const res = await api().get(`/chat`);
			const chat = res.data.reverse();

			this.chat.all = chat;
		},
		async getPrivate(login, room) {
			const res = await api().get(`/chat/${login}`);
			const chat = res.data.reverse();

			this.chat[room] = chat;
		},
	},
});
