<script setup>
import SocketioService from "@/services/socketio.service.js";
import { onMounted, ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";
import ChatMessage from "@/components/ChatMessage.vue";
import Cookies from "js-cookie";

const chatStore = useChatStore();
const userStore = useUserStore();

onMounted(() => {
	if (!SocketioService.isActive()) {
		SocketioService.setupSocketConnection();
	}

	chatStore.getAll();
	userStore.getAll();
});

const userColorCookie = parseInt(Cookies.get("userColor"));
const othersColorCookie = parseInt(Cookies.get("othersColor"));

const getCookieColor = (from) => {
	const cookie = from === userStore.user.login ? userColorCookie : othersColorCookie;

	if (isNaN(cookie)) {
		return 0;
	}
	return cookie;
};

const currentRoom = ref("all");
const selectedChat = ref("all");

const handelSelect = () => {
	if (selectedChat.value == "all") {
		currentRoom.value = "all";
		chatStore.getAll();
	} else {
		let logins = [selectedChat.value, userStore?.user?.login];
		logins.sort();
		currentRoom.value = logins.join("");

		chatStore.getPrivate(selectedChat.value, currentRoom.value);
	}

	SocketioService.joinRoom(currentRoom.value);
};

const myMsg = ref("");

const getMsgClass = (from) => {
	return from === userStore.user.login ? "user-msg" : "other-msg";
};

const sendMsg = () => {
	SocketioService.sendMsg({
		content: myMsg.value,
		from: userStore.user?.login,
		to: selectedChat.value,
	});
	myMsg.value = "";
};
</script>

<template>
	<h1>
		Current chat:
		<select class="chat-select" v-model="selectedChat" @change="handelSelect">
			<option value="all">All</option>
			<option v-for="{ login } in userStore.differentUser" :value="login">{{ login }}</option>
		</select>
	</h1>
	<div class="chat">
		<div class="messages">
			<ChatMessage v-for="{ id, from, to, content, dateSend } in chatStore.chat[currentRoom]" :key="id" :class="getMsgClass(from)" class="chat-msg" :color="getCookieColor(from)" :sender="from" :date="dateSend">
				{{ content }}
			</ChatMessage>
		</div>
		<input class="chat-input" type="text" v-model="myMsg" @keyup.enter="sendMsg" />
	</div>
</template>

<style scoped>
.chat {
	height: clamp(auto, 100%, 100%);
	border: 1px solid var(--light);
	padding: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 1rem;
}

.chat-select {
	color: var(--light);
	background-color: transparent;
	font-size: 1em;
}

.chat-select option {
	color: var(--dark);
}

.messages {
	height: calc(100vh - 80px - 6rem);
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
</style>
