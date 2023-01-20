import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Cookies from "js-cookie";

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
	],
});

router.beforeEach((to, from) => {
	if (["login", "register"].includes(to.name)) return true;

	const userId = Cookies.get("userId");

	if (userId) return true;

	router.push("/login");
	//  return false to cancel the navigation
	return false;
});

export default router;
