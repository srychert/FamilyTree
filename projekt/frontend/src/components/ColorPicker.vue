<script setup>
import { ref, watch } from "vue";

const props = defineProps({
	color: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits(["pickColor"]);

const pickedColor = ref(props.color);

watch(pickedColor, (newColor) => {
	emit("pickColor", newColor);
});

const updateColorByClick = (colorIndex) => {
	pickedColor.value = colorIndex;
};

const updateColorByInput = (e) => {
	let newColor = parseInt(e.target.value);

	if (isNaN(newColor)) {
		newColor = 0;
	}

	pickedColor.value = newColor;
};
</script>

<template>
	<div class="color-picker">
		<div class="colors">
			<div v-for="i in 359" :style="{ backgroundColor: `hsl(${i}, 100%, 50%)` }" @click="updateColorByClick(i)"></div>
		</div>
		<input type="number" :value="pickedColor" @input="updateColorByInput" />
	</div>
</template>

<style scoped>
.message {
	width: 300px;
	height: 200px;
}
.color-picker {
	display: flex;
	flex-direction: column;
}
.color-picker > .colors {
	flex: 1;
	display: flex;
	flex-direction: column;
	cursor: pointer;
	border: 2px solid var(--light);
	border-radius: 1rem 1rem 0% 0%;
	overflow: hidden;
}

.color-picker > .colors > div {
	flex: 1;
}

.color-picker > input {
	padding: 0.5em;
}
</style>
