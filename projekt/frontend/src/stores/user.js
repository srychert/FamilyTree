import { defineStore } from "pinia";
import api from "../api";
import Cookies from "js-cookie";

export const useUserStore = defineStore("user", {
	state: () => ({
		user: null,
	}),

	actions: {
		async logIn(login, password) {
			const res = await api().post("/login", {
				login,
				password,
			});

			const user = res.data;
			Cookies.set("userId", user.id);
			this.user = user;
		},
		async logOut() {
			await api().post("/logout");
			Cookies.remove("userId");
			this.user = null;
		},
		async getUser(id) {
			const res = await api().get(`/users/${id}`);
			const user = res.data;

			this.user = user;
		},
		async register(login, password) {
			const res = await api().post(`/users`, {
				login,
				password,
			});
			const user = res.data;

			this.user = user;
		},
	},
});
