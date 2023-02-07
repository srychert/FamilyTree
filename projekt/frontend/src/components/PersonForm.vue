<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
	firstName: String,
	lastName: String,
	dateOfBirth: String,
	gender: String,
	handelSubmit: Function,
	inputText: String,
	errorText: String,
});

const emit = defineEmits(["update:firstName", "update:lastName", "update:dateOfBirth", "update:gender"]);

const checked = ref(true);

const genderCopy = computed(() => props.gender);
watch(genderCopy, (newG, _) => {
	console.log(newG);
	checked.value = newG === "male";
});

const color = computed(() => (props.gender === "male" ? "cyan" : "hotpink"));

const updateGender = (value, newChecked) => {
	checked.value = newChecked;
	emit("update:gender", value);
};
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

		<div class="form-row radio-row">
			<div class="radio-wrapper">
				<input id="male" type="radio" :checked="checked" value="male" @click="updateGender('male', true)" />
				<label for="male">Male</label>
			</div>
			<div class="radio-wrapper">
				<input id="female" type="radio" :checked="!checked" value="female" @click="updateGender('female', false)" />
				<label for="female">Female</label>
			</div>
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

.radio-row {
	flex-direction: row;
	gap: 16px;
}

.radio-wrapper {
	display: flex;
	gap: 8px;
	font-size: 1.2em;
}

input[type="radio"] {
	all: unset;
}

input[type="radio"]::before {
	content: "";
	display: inline-block;
	width: 0.65em;
	height: 0.65em;
	border-radius: 50%;
	background-color: currentColor;
}

input[type="radio"]:checked::before {
	background-color: v-bind(color);
}

input[type="submit"] {
	width: fit-content;
}
</style>
