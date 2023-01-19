<script setup>
import Navigaton from "@/components/Navigation.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
	<div class="sidebar">
		<div class="logo">
			<div class="profile">
				<span v-if="userStore.user">{{ userStore.user.login[0] }}</span>
				<span v-else>U</span>
			</div>
		</div>
		<Navigaton />
	</div>
</template>

<style scoped>
.sidebar {
	height: 100vh;
	width: clamp(300px, 30vw, 400px);
	border: 1px solid var(--light);

	display: flex;
	flex-direction: column;
}

.logo {
	aspect-ratio: 16/9;
	background-color: var(--light);
	display: grid;
	place-content: center;
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
}
</style>
