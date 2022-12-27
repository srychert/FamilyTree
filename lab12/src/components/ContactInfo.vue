<template>
	<li>
		<h2>{{ name }} <img v-if="isFriend" class="friendIcon" src="friends.png" alt="" /></h2>
		<button @click="toggleFriend">Usuń/Dodaj ze/do znajomych</button>
		<button @click="toggleDetails">Ukryj/Pokaż szczegóły</button>
		<ul v-show="showDetails">
			<li>
				<strong>telefon:</strong>
				{{ phoneNumber }}
			</li>
			<li>
				<strong>e-mail:</strong>
				{{ emailAddress }}
			</li>
		</ul>
	</li>
</template>

<script>
export default {
	props: ["name", "phoneNumber", "emailAddress", "friend"],
	data() {
		return {
			showDetails: false,
			isFriend: this.friend,
		};
	},
	methods: {
		toggleDetails() {
			this.showDetails = !this.showDetails;
		},
		toggleFriend() {
			this.isFriend = !this.isFriend;
		},
	},
};
</script>

<style>
.friendIcon {
	margin-left: 10px;
	width: 30px;
}
</style>
