<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const login = ref("");
const password = ref("");
const error = ref("");

const handelLogin = () => {
	userStore
		.logIn(login.value, password.value)
		.then(() => router.push("/"))
		.catch((err) => {
			console.error(err);
			if (err.response.status === 401) {
				error.value = "Incorrect Credentials";
				console.log(error);
			}
		});
};
</script>

<template>
	<h1>LogIn</h1>
	<form @submit.prevent="handelLogin">
		<div class="form-row">
			<label for="login">Login</label>
			<input id="login" type="text" v-model="login" required />
		</div>

		<div class="form-row">
			<label for="password">Password</label>
			<input id="password" type="password" v-model="password" required />
		</div>

		<input type="submit" value="Login" />
	</form>
	<span class="error">{{ error }}</span>
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
