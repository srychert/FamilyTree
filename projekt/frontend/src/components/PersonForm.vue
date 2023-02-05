<script setup>
const props = defineProps({
	firstName: String,
	lastName: String,
	dateOfBirth: String,
	handelSubmit: Function,
	inputText: String,
	errorText: String,
});

defineEmits(["update:firstName", "update:lastName", "update:dateOfBirth"]);
</script>

<template>
	<form @submit.prevent="handelSubmit">
		<div class="form-row">
			<label for="firstName">First Name</label>
			<input id="firstName" type="text" :value="firstName" @input="$emit('update:firstName', $event.target.value)" required />
		</div>

		<div class="form-row">
			<label for="lastName">Last Name</label>
			<input id="lastName" type="text" :value="lastName" @input="$emit('update:lastName', $event.target.value)" required />
		</div>

		<div class="form-row">
			<label for="dateOfBirth">Date Of Birth</label>
			<input id="dateOfBirth" type="date" :value="dateOfBirth" @input="$emit('update:dateOfBirth', $event.target.value)" required />
		</div>

		<input type="submit" :value="props.inputText" />
	</form>
	<span class="error">{{ errorText }}</span>
</template>

<style scoped>
form {
	max-width: 20em;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

input[type="submit"] {
	width: fit-content;
}
</style>
