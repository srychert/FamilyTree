<script setup>
import SocketioService from "@/services/socketio.service.js";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";
import ChatMessage from "@/components/ChatMessage.vue";
import Cookies from "js-cookie";

const chatStore = useChatStore();
const userStore = useUserStore();

const chatInput = ref(null);

onMounted(() => {
	if (!SocketioService.isActive()) {
		SocketioService.setupSocketConnection();
		chatStore.getAll();
	}

	chatInput.value?.scrollIntoView();
});

// onBeforeUnmount(() => {
// 	SocketioService.disconnect();
// });

const userColorCookie = parseInt(Cookies.get("userColor"));
const othersColorCookie = parseInt(Cookies.get("othersColor"));

const getCookieColor = (from) => {
	const cookie = from === userStore.user.login ? userColorCookie : othersColorCookie;

	if (isNaN(cookie)) {
		return 0;
	}
	return cookie;
};

const getMsgClass = (from) => {
	return from === userStore.user.login ? "user-msg" : "other-msg";
};

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
	<div class="chat">
		<div class="messages">
			<ChatMessage v-for="{ id, from, to, content, dateSend } in chatStore.chat" :key="id" :class="getMsgClass(from)" class="chat-msg" :color="getCookieColor(from)" :sender="from" :date="dateSend">
				{{ content }}
			</ChatMessage>
		</div>
		<input ref="chatInput" class="chat-input" type="text" v-model="myMsg" @keyup.enter="sendMsg" />
	</div>
</template>

<style scoped>
.chat {
	height: 100%;
	border: 1px solid var(--light);
	padding: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 1rem;
}

.messages {
	height: calc(100vh - 40px - 6rem);
	overflow: auto;
	overflow-x: hidden;
	display: flex;
	flex-direction: column-reverse;
	gap: 1rem;
	padding: 0 1rem;
}

.chat-msg {
	width: fit-content;
	max-width: 80%;
}

.user-msg {
	align-self: flex-end;
}

.chat-input {
	width: 100%;
}
</style>
