<script setup>
import { ref } from "vue";
import { useTreeStore } from "@/stores/tree";

const treeStore = useTreeStore();

const firstName = ref("");
const lastName = ref("");
const dateOfBirth = ref("");
const error = ref("");

const handleCreateTree = () => {
	treeStore
		.createTree({
			firstName: firstName.value,
			lastName: lastName.value,
			dateOfBirth: dateOfBirth.value,
		})
		.catch((err) => {
			console.error(err);
			if (err.message) {
				error.value = err.message;
			}
		});
};
</script>

<template>
	<div>
		<form @submit.prevent="handleCreateTree">
			<div class="form-row">
				<label for="firstName">First Name</label>
				<input id="firstName" type="text" v-model="firstName" required />
			</div>

			<div class="form-row">
				<label for="lastName">Last Name</label>
				<input id="lastName" type="text" v-model="lastName" required />
			</div>

			<div class="form-row">
				<label for="dateOfBirth">Date Of Birth</label>
				<input id="dateOfBirth" type="date" v-model="dateOfBirth" required />
			</div>

			<input type="submit" value="Create Tree" />
		</form>
		<span class="error">{{ error }}</span>
	</div>
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
