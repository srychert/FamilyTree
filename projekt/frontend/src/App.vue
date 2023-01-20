<script setup>
import SideBar from "@/components/SideBar.vue";
import MainContent from "@/components/MainContent.vue";
import { useUserStore } from "@/stores/user";
import Cookies from "js-cookie";

const userStore = useUserStore();
const userId = Cookies.get("userId");

if (!userStore.user && userId) {
	userStore.getUser(userId).catch((err) => console.error(err));
}
</script>

<template>
	<SideBar></SideBar>
	<MainContent />
</template>

<style scoped></style>
