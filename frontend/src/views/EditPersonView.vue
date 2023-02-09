<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
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

onMounted(() => {
	treeStore.getPerson(route.query.personId).then((p) => {
		firstName.value = p.firstName;
		lastName.value = p.lastName;
		dateOfBirth.value = p.dateOfBirth;
		gender.value = p.gender;
	});
});

const handelEditParent = () => {
	treeStore
		.editPerson(route.query.personId, {
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
	<h1>Edit parent</h1>
	<PersonForm v-model:firstName="firstName" v-model:lastName="lastName" v-model:dateOfBirth="dateOfBirth" v-model:gender="gender" v-model:handelSubmit="handelEditParent" inputText="Edit" :errorText="errorText"></PersonForm>
</template>

<style scoped></style>
