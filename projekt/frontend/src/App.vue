<script setup>
import SideBar from "@/components/SideBar.vue";
import MainContent from "@/components/MainContent.vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const userStore = useUserStore();
const router = useRouter();

if (!userStore.user) {
	const userId = Cookies.get("userId");
	if (userId) {
		userStore.getUser(userId).catch((err) => console.error(err));
	} else {
		router.push("/login");
	}
}
</script>

<template>
	<SideBar></SideBar>
	<MainContent />
</template>

<style scoped></style>
