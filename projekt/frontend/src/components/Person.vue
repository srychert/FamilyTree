<script setup>
const props = defineProps({
	id: {
		type: Number,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	dateOfBirth: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<div class="person" @click="showMenu">
		<span>{{ firstName }}</span>
		<span>{{ lastName }}</span>
		<span class="dob">{{ dateOfBirth }}</span>
	</div>
</template>

<style scoped>
.person {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 1em;
	border: 1px solid;
}
</style>
