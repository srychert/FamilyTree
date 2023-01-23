import { defineStore } from "pinia";
import api from "../api";

export const useChatStore = defineStore("chat", {
	state: () => ({
		chat: [],
	}),

	actions: {
		async addMsg(msg) {
			this.chat.push(msg);
		},
	},
});
