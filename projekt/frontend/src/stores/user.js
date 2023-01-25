import { defineStore, getActivePinia } from "pinia";
import api from "../api";
import Cookies from "js-cookie";

export const useUserStore = defineStore("user", {
	state: () => ({
		user: null,
		users: [],
	}),

	getters: {
		differentUser(state) {
			return state.users.filter((u) => u.login !== state.user.login);
		},
	},

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
			// this.user = null;

			// reset all stores
			getActivePinia()._s.forEach((store) => store.$reset());
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
		},
		async getAll() {
			const res = await api().get(`/users`);
			const users = res.data;

			this.users = users;
		},
	},
});
