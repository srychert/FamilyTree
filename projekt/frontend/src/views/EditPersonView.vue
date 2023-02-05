<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { useTreeStore } from "@/stores/tree";
import PersonForm from "../components/PersonForm.vue";

const router = useRouter();
const route = useRoute();

const treeStore = useTreeStore();

// TODO get default values
const firstName = ref("");
const lastName = ref("");
const dateOfBirth = ref("");
const errorText = ref("");

const handelEditParent = () => {
	treeStore
		.editPerson(route.query.personId, {
			firstName: firstName.value,
			lastName: lastName.value,
			dateOfBirth: dateOfBirth.value,
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
	<h1>Edit parent</h1>
	<PersonForm v-model:firstName="firstName" v-model:lastName="lastName" v-model:dateOfBirth="dateOfBirth" v-model:handelSubmit="handelEditParent" inputText="Edit parent" :errorText="errorText"></PersonForm>
</template>

<style scoped></style>
