<template>
	<div>
		Edycja kontaktu
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
		<button class="btn-form" @click="editContact">Zapisz</button>
	</div>
</template>

<script>
import DataService from "@/services/DataService.js";

export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			name: this.item.name,
			age: this.item.age,
			email: this.item.email,
			address: this.item.address,
		};
	},
	created() {
		console.log("Edycja kontaktu");
		console.log(this.item.id);
	},
	methods: {
		editContact() {
			const updatedContact = {
				id: this.item.id,
				name: this.name,
				age: this.age,
				email: this.email,
				address: this.address,
			};

			console.log(updatedContact);

			DataService.editPerson(updatedContact)
				.then((response) => {
					console.log(response.data);
					this.$router.push({
						name: "ContactDetails",
					});
				})
				.catch((err) => {
					console.log(err);
					this.$router.push({ name: "NetworkError" });
				});
		},
	},
};
</script>
