<script setup>
import ColorPicker from "@/components/ColorPicker.vue";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import Cookies from "js-cookie";
import ChatMessage from "@/components/ChatMessage.vue";

const userStore = useUserStore();

const userColorCookie = parseInt(Cookies.get("userColor"));
const othersColorCookie = parseInt(Cookies.get("othersColor"));

const userColor = ref(isNaN(userColorCookie) ? 0 : userColorCookie);
const othersColor = ref(isNaN(othersColorCookie) ? 0 : othersColorCookie);

const updateUserColor = (newColor) => {
	userColor.value = newColor;
	Cookies.set("userColor", newColor);
};

const updateOthersColor = (newColor) => {
	othersColor.value = newColor;
	Cookies.set("othersColor", newColor);
};
</script>

<template>
	<div>
		<h1>Welcome {{ userStore.user?.login }}!</h1>
		<div class="wrapper">
			<div class="color-pickers">
				<ColorPicker :color="userColor" @pickColor="updateUserColor" />
				<ColorPicker :color="othersColor" @pickColor="updateOthersColor" />
			</div>
			<div class="chat-msgs">
				<ChatMessage :color="userColor" :sender="userStore.user.login" :date="new Date().toString()"> Your chat color </ChatMessage>
				<ChatMessage :color="othersColor" sender="someone" :date="new Date().toString()"> Others chat color </ChatMessage>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
}

.color-pickers {
	display: flex;
	gap: 0.5rem;
}

.chat-msgs {
	display: grid;
	gap: 0.5rem;
}

.color-picker {
	min-height: 400px;
	max-width: 4rem;
	overflow: auto;
	resize: vertical;
}

.color-picker > .colors {
	border-radius: 1rem;
}
</style>
