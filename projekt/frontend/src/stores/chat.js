import { defineStore } from "pinia";
import api from "../api";

export const useChatStore = defineStore("chat", {
	state: () => ({
		chat: [],
	}),

	actions: {
		async addMsg(msg) {
			this.chat.unshift(msg);
		},
		async getAll() {
			const res = await api().get(`/chat`);
			const chat = res.data.reverse();

			this.chat = chat;
		},
	},
});
