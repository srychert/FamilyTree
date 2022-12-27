<template>
	<li>
		<h2>{{ name }} <img v-if="isFriend" class="friendIcon" src="friends.png" alt="" /></h2>
		<button @click="toggleFriend">
			<span v-if="isFriend">Usuń ze znajomych</span>
			<span v-else>Dodaj do znajomych</span>
		</button>
		<button @click="toggleDetails">
			<span v-if="showDetails">Ukryj szczegóły</span>
			<span v-else>Pokaż szczegóły</span>
		</button>
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
