<script setup>
import Navigaton from "@/components/Navigation.vue";
import { useUserStore } from "@/stores/user";
import Burger from "@/components/Burger.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const isOpen = ref(true);
const spanBackground = ref("var(--dark)");

const handleToggleNav = (e) => {
	isOpen.value = e;
	if (isOpen.value) {
		spanBackground.value = "var(--dark)";
	} else {
		spanBackground.value = "var(--light)";
	}
};

const goToProfile = () => router.push("/profile");
</script>

<template>
	<Burger :spanBackground="spanBackground" @toggleOpen="handleToggleNav" />
	<div class="sidebar" :class="{ open: isOpen }">
		<div class="logo">
			<div class="profile" tabindex="0" @click="goToProfile">
				<span v-if="userStore.user">{{ userStore.user.login[0] }}</span>
				<span v-else>P</span>
			</div>
		</div>
		<Navigaton />
	</div>
</template>

<style scoped>
.sidebar {
	height: 100vh;
	min-width: 300px;
	width: clamp(300px, 30vw, 400px);
	border: 1px solid var(--light);
	background: black;

	display: flex;
	flex-direction: column;

	left: -300px;
	transition: left ease-in 0.3s;
	z-index: 1;
}

.sidebar.open {
	left: 0;
}

@media (max-width: 900px) {
	.sidebar {
		position: absolute;
	}
}

.logo {
	aspect-ratio: 16/9;
	background-color: var(--light);
	display: grid;
	place-content: center;
}

.burger {
	position: absolute;
	top: 1em;
	left: 1em;
}

@media (min-width: 900px) {
	.burger {
		display: none;
	}
}

.profile {
	width: 100px;
	aspect-ratio: 1/1;
	border: 1px solid var(--dark);
	border-radius: 50%;

	display: grid;
	place-content: center;
	font-size: xx-large;
	color: var(--dark);
	text-transform: capitalize;
	user-select: none;
	cursor: pointer;
}

.profile:hover,
.profile:focus {
	color: var(--light);
	background: var(--dark);
}
</style>
