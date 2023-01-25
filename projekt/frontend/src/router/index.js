import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/user";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/login",
			name: "login",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/LoginView.vue"),
		},
		{
			path: "/register",
			name: "register",
			component: () => import("../views/RegisterView.vue"),
		},
		{
			path: "/profile",
			name: "profile",
			component: () => import("../views/ProfileView.vue"),
		},
		{
			path: "/chat",
			name: "chat",
			component: () => import("../views/ChatView.vue"),
		},
	],
});

router.beforeEach(async (to, from) => {
	// allowed routes for not logedIn users
	if (["login", "register"].includes(to.name)) return true;

	const userId = Cookies.get("userId");
	const userStore = useUserStore();

	if (userStore.user && userId) {
		return true;
	}

	if (!userStore.user && userId) {
		userStore
			.getUser(userId)
			.then((r) => {
				router.push(to);
				return true;
			})
			.catch((err) => {
				if (err.response.status === 401) {
					Cookies.remove("userId");
					router.push("/login");
				} else {
					console.error(err);
					// maybe push to error page?
				}
			});
	}

	if (!userStore.user && !userId) {
		router.push("/login");
		return false;
	}
});

export default router;
