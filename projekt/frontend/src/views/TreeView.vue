<script setup>
import { onMounted } from "vue";
import { useTreeStore } from "@/stores/tree";
import CreateTreeForm from "@/components/CreateTreeForm.vue";
import Person from "@/components/Person.vue";

const treeStore = useTreeStore();

onMounted(() => {
	treeStore.getOwner().then((_) => {
		if (treeStore.owner.id !== undefined) {
			for (let i = 1; i < 5; i++) {
				treeStore.getParents(treeStore.owner.id, i);
			}
		}
	});
});
</script>

<template>
	<CreateTreeForm v-if="Object.keys(treeStore.owner).length === 0" />

	<div v-else class="tree">
		<div class="column" v-for="(column, key) in treeStore.tree">
			<div v-for="person in column">
				<!-- prettier-ignore -->
				<Person :id="person.id"
                    :firstName="person.firstName"
                    :lastName="person.lastName"
                    :dateOfBirth="person.dateOfBirth" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.tree {
	height: calc(100% - 2px);
	display: flex;
}

.column {
	padding: 16px;
	outline: 1px solid red;
	display: grid;
	place-content: center;
}
</style>
