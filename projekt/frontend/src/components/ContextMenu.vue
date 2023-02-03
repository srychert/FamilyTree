<script setup>
import { ref } from "vue";

const props = defineProps({
	items: Array,
});

const isOpen = ref(false);
const clientX = ref("0px");
const clientY = ref("0px");

const lastClick = ref(null);

const toggle = (e) => {
	e.preventDefault();

	clientX.value = `${e.clientX}px`;
	clientY.value = `${e.clientY}px`;

	if (lastClick.value == e.currentTarget) {
		isOpen.value = !isOpen.value;
		return;
	} else {
		isOpen.value = true;
	}

	lastClick.value = e.currentTarget;
};

defineExpose({
	toggle,
});
</script>

<template>
	<div v-if="isOpen" id="context-menu" class="context-menu">
		<div v-for="item in items">{{ item }}</div>
	</div>
</template>

<style scoped>
.context-menu {
	padding: 20px;
	color: black;
	background-color: white;

	position: fixed;
	top: v-bind(clientY);
	left: v-bind(clientX);
	z-index: 999;
}
</style>
