<script setup>
import SocketioService from "@/services/socketio.service.js";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";

const chatStore = useChatStore();
const userStore = useUserStore();

onMounted(() => {
	if (!SocketioService.isActive()) {
		SocketioService.setupSocketConnection();
	}
});

// onBeforeUnmount(() => {
// 	SocketioService.disconnect();
// });

const myMsg = ref("");

const sendMsg = () => {
	SocketioService.sendMsg({
		content: myMsg.value,
		from: userStore.user?.login,
		to: "all",
	});
	myMsg.value = "";
};
</script>

<template>
	<h1>Chat</h1>

	<input type="text" v-model="myMsg" @keyup.enter="sendMsg" />

	<ul>
		<li v-for="{ id, from, to, content, dateSend } in chatStore.chat" :key="id">{{ content }}, {{ from }}, {{ to }}, {{ dateSend }}</li>
	</ul>
</template>

<style lang="scss" scoped></style>
