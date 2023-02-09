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
		<div class="link-wrapper">
			<span class="material-symbols-outlined"> home </span>
			<RouterLink to="/" class="link underline"> Home </RouterLink>
		</div>
		<div class="link-wrapper">
			<span class="material-symbols-outlined"> nature </span>
			<RouterLink to="/tree" class="link underline"> Tree </RouterLink>
		</div>
		<div class="link-wrapper">
			<span class="material-symbols-outlined"> chat </span>
			<RouterLink to="/chat" class="link underline"> Chat </RouterLink>
		</div>
		<div v-if="!userStore.user" class="link-wrapper login-wrapper">
			<RouterLink to="/register" class="link register underline">Register</RouterLink>
			<RouterLink to="/login" class="link login underline">LogIn</RouterLink>
			<div class="divider"></div>
		</div>
		<div v-else class="link-wrapper logout">
			<a tabindex="0" class="link underline" @click="handelLogout" @keyup.enter="handelLogout"> LogOut </a>
		</div>
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
	display: flex;
	align-items: center;
	gap: 4px;

	padding: 2em;
	border-bottom: 1px solid var(--light);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.link {
	color: var(--light);
	text-decoration: none;
}

.link:focus {
	outline: none;
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

.login::after {
	background-color: var(--dark);
}

.logout {
	cursor: pointer;
	user-select: none;
}
</style>
