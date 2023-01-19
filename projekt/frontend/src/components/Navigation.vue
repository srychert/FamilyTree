<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();

const handelLogout = async () => {
	await userStore.logOut();
	router.push("/login");
};
</script>

<template>
	<nav>
		<RouterLink to="/" class="link link-wrapper">
			<span class="material-symbols-outlined"> home </span>
			<span>Home</span>
		</RouterLink>
		<RouterLink to="/tree" class="link link-wrapper">
			<span class="material-symbols-outlined"> nature </span>
			<span>Tree</span>
		</RouterLink>
		<div v-if="!userStore.user" class="link-wrapper login-wrapper">
			<RouterLink to="/register" class="link register">Register</RouterLink>
			<RouterLink to="/login" class="link login">LogIn</RouterLink>
			<div class="divider"></div>
		</div>
		<a v-else tabindex="0" class="link link-wrapper logout" @click="handelLogout" @keyup.enter="handelLogout"> LogOut </a>
	</nav>
</template>

<style scoped>
nav {
	flex: 1;
	display: flex;
	flex-direction: column;
	font-size: 1.25rem;
}

.link-wrapper {
	display: block;
	padding: 2em;
	border-bottom: 1px solid var(--light);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.link {
	color: var(--light);
	text-decoration: none;
	display: flex;
	align-items: center;
	gap: 4px;
}

.link:focus {
	background-color: var(--dark-focus);
	outline: none;
	border: none;
}

.divider {
	display: block;
	width: calc(100% + 1px);
	height: calc(100% + 1px);
	position: absolute;
	top: -1px;
	left: -1px;
	background-color: var(--light);
	clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%);
	z-index: -1;
}

.login-wrapper,
.logout {
	margin-top: auto;
	border-bottom: none;
	border-top: 1px solid;
}

.login-wrapper {
	display: flex;
	justify-content: space-between;
}

.register {
	color: var(--light);
}

.login {
	color: var(--dark);
}

.login:focus,
.register:focus {
	background-color: inherit;
}

.login::after,
.register::after {
	content: "";
	position: absolute;
	width: 100%;
	transform: scaleX(0);
	height: 2px;
	bottom: 0;
	left: 0;
	transform-origin: bottom right;
	transition: transform 0.25s ease-out;
}

.login::after {
	background-color: var(--dark);
}

.register::after {
	background-color: var(--light);
}

.login:focus::after,
.login:hover::after,
.register:focus::after,
.register:hover::after {
	transform: scaleX(1);
	transform-origin: bottom left;
}

.logout {
	cursor: pointer;
	user-select: none;
}
</style>
