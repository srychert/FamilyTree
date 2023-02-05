<script setup>
const props = defineProps({
	person: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<div class="person" @click="showMenu">
		<span>{{ person?.firstName }}</span>
		<span>{{ person?.lastName }}</span>
		<span class="dob">{{ person?.dateOfBirth }}</span>
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
