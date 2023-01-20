<script setup>
import { ref } from "vue";

defineProps({
	spanBackground: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(["toggleOpen"]);
const isOpen = ref(true);

const handelClick = () => {
	isOpen.value = !isOpen.value;
	emit("toggleOpen", isOpen.value);
};
</script>

<template>
	<div class="burger" :class="{ open: isOpen }" @click="handelClick">
		<span :style="{ background: spanBackground }"></span>
		<span :style="{ background: spanBackground }"></span>
		<span :style="{ background: spanBackground }"></span>
	</div>
</template>

<style scoped>
.burger {
	z-index: 999;
	display: relative;
	font-size: 1.2em;
	cursor: pointer;
}
.burger span {
	display: block;
	width: 30px;
	height: 2px;
	margin-bottom: 5px;
}

/* open state */

.burger.open span:nth-child(1) {
	transform: rotate(45deg) translateY(10px);
}
.burger.open span:nth-child(2) {
	opacity: 0;
	width: 0;
}
.burger.open span:nth-child(3) {
	transform: rotate(-45deg) translateY(-10px);
}

/* transition */
.burger span {
	transition: all ease-in 0.3s;
}
</style>
