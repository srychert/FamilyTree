<script setup>
import { ref } from "vue";
import { useTreeStore } from "@/stores/tree";
import PersonForm from "../components/PersonForm.vue";

const treeStore = useTreeStore();

const firstName = ref("");
const lastName = ref("");
const dateOfBirth = ref("");
const gender = ref("male");
const errorText = ref("");

const handleCreateTree = () => {
	treeStore
		.createTree({
			firstName: firstName.value,
			lastName: lastName.value,
			dateOfBirth: dateOfBirth.value,
			gender: gender.value,
		})
		.then((_) => {
			for (let i = 1; i < 4; i++) {
				treeStore.tree[i] = {};
			}
		})
		.catch((err) => {
			console.error(err);
			if (err.message) {
				errorText.value = err.message;
			}
		});
};
</script>

<template>
	<PersonForm v-model:firstName="firstName" v-model:lastName="lastName" v-model:dateOfBirth="dateOfBirth" v-model:gender="gender" v-model:handelSubmit="handleCreateTree" inputText="Create tree" :errorText="errorText"></PersonForm>
</template>

<style scoped></style>
