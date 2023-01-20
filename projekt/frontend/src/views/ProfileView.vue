<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
	<div>
		<h1>Welcome {{ userStore.user?.login }}!</h1>
	</div>
</template>

<style scoped></style>
