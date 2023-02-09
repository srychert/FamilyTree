<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { useTreeStore } from "@/stores/tree";
import PersonForm from "../components/PersonForm.vue";

const router = useRouter();
const route = useRoute();

const treeStore = useTreeStore();

const firstName = ref("");
const lastName = ref("");
const dateOfBirth = ref("");
const gender = ref("male");
const errorText = ref("");

const handleAddParent = () => {
	treeStore
		.addParent(route.query.childId, {
			firstName: firstName.value,
			lastName: lastName.value,
			dateOfBirth: dateOfBirth.value,
			gender: gender.value,
		})
		.then((_) => {
			router.push("/tree");
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
	<h1>Add parent</h1>
	<PersonForm v-model:firstName="firstName" v-model:lastName="lastName" v-model:dateOfBirth="dateOfBirth" v-model:gender="gender" v-model:handelSubmit="handleAddParent" inputText="Add parent" :errorText="errorText"></PersonForm>
</template>

<style scoped></style>
