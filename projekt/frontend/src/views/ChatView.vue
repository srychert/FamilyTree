<script setup>
import SocketioService from "@/services/socketio.service.js";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();

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
	console.log(myMsg.value);
	SocketioService.sendMsg(myMsg.value);
	myMsg.value = "";
};
</script>

<template>
	<h1>Chat</h1>

	<input type="text" v-model="myMsg" @keyup.enter="sendMsg" />

	<ul>
		<li v-for="{ msg } in chatStore.chat" :key="msg">
			{{ msg }}
		</li>
	</ul>
</template>

<style lang="scss" scoped></style>
