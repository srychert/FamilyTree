<template>
	<div>
		Dodawanie kontaktu
		<form>
			<div class="form-row">
				<label for="name">Imię</label>
				<input id="name" type="text" v-model="name" required />
			</div>
			<div class="form-row">
				<label for="age">Wiek</label>
				<input id="age" type="number" v-model="age" min="1" required />
			</div>
			<div class="form-row">
				<label for="email">Email</label>
				<input id="email" type="email" v-model="email" required />
			</div>
			<div class="form-row">
				<label for="address">Adres</label>
				<input id="address" type="text" v-model="address" required />
			</div>
		</form>
		<button class="btn-form" @click="addContact">Dodaj</button>
	</div>
</template>

<script>
import DataService from "@/services/DataService.js";

export default {
	props: ["item"],
	created() {
		console.log("Edycja kontaktu");
	},
	data() {
		return {
			name: "",
			age: 1,
			email: "",
			address: "",
		};
	},
	methods: {
		addContact() {
			const newContact = {
				name: this.name,
				age: this.age,
				email: this.email,
				address: this.address,
			};

			console.log(newContact);

			DataService.postPerson(newContact)
				.then((response) => {
					console.log(response.data);
					// „programowo” przełączamy sie na szczegóły kontaktu
					this.$router.push({
						name: "ContactDetails",
						// params: {id: this.item.id } // niepotrzebne
					});
					// ścieżka wygląda nastepujaco /person/:id/add
				})
				.catch((err) => {
					console.log(err);
					this.$router.push({ name: "NetworkError" });
				});
		},
	},
};
</script>

<style scoped>
form {
	display: grid;
	place-content: center;
	margin: 20px 0;
	gap: 8px;
}

.form-row {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.btn-form {
	color: white;
	background-color: hsl(153, 47%, 49%);
	border: none;
	padding: 1em;
	cursor: pointer;
}

.btn-form:hover {
	background-color: hsl(153, 47%, 54%);
}
</style>
