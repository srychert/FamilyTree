<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
	color: {
		type: Number,
		required: true,
	},
	sender: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
});

const dateSend = computed(() => new Date(props.date).toLocaleString());
</script>

<template>
	<div>
		<div class="message">
			<slot></slot>
		</div>
		<div class="info">
			<span class="sender">{{ sender }}</span> {{ dateSend }}
		</div>
	</div>
</template>

<style scoped>
.message {
	padding: 1em;
	/* From https://css.glass */
	background: hsla(v-bind(color), 100%, 50%, 0.3);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.5);
}
.info {
	display: flex;
	gap: 4px;
	font-size: 0.7em;
}

.sender {
	text-transform: uppercase;
	font-weight: bold;
}
</style>
