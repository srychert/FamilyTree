<script setup>
import { onMounted, ref } from "vue";
import { useTreeStore } from "@/stores/tree";
import CreateTreeForm from "@/components/CreateTreeForm.vue";
import Person from "@/components/Person.vue";
import ContextMenu from "@/components/ContextMenu.vue";

const treeStore = useTreeStore();
// 2*currentMaxLevel = number of parent nodes in column
const currentMaxLevel = ref(4);
const contextMenuRef = ref(null);

onMounted(() => {
	treeStore.getOwner().then((_) => {
		if (treeStore.owner.id !== undefined) {
			for (let i = 1; i < currentMaxLevel.value; i++) {
				treeStore.getParents(treeStore.owner.id, i);
			}
		}
	});
});

const handelLoadNextLevel = () => {
	treeStore.getParents(treeStore.owner.id, currentMaxLevel.value).then((_) => (currentMaxLevel.value += 1));
};

const handelMenuClick = (e, level, person) => {
	const others = level != 0 ? treeStore.getOtherParents(level, person.childId, person.id) : [];
	contextMenuRef.value.toggle(e, level, person, others);
};
</script>

<template>
	<CreateTreeForm v-if="Object.keys(treeStore.owner).length === 0" />

	<div v-else class="tree">
		<div class="column" v-for="(parents, level) in treeStore.getActive" :style="`grid-template-rows: repeat(${2 ** Number.parseInt(level)}, minmax(0, 1fr))`">
			<Person v-if="level == 0" v-for="person in parents" @click="(e) => handelMenuClick(e, level, person)" :person="person" :id="person.id" />
			<template v-for="personList in parents">
				<template v-for="person in personList">
					<Person v-if="person?.active" :person="person" @click="(e) => handelMenuClick(e, level, person)" />
					<Person v-else v-if="level != 0" :person="{}" />
				</template>
			</template>
		</div>
		<div class="column">
			<button class="load-more material-symbols-outlined" @click="handelLoadNextLevel">add_circle</button>
		</div>
	</div>

	<ContextMenu ref="contextMenuRef"></ContextMenu>
</template>

<style scoped>
.tree {
	/* height: calc(100% - 2px); */
	height: calc(100vh - 42px);
	padding: 4px;
	display: grid;
	grid-template-columns: repeat(v-bind(currentMaxLevel), minmax(200px, 1fr)) 0.5fr;

	font-size: 1.25em;
	font-weight: bold;
	overflow: auto;
}

.column {
	padding: 16px;
	outline: 1px solid hsl(100, 100%, 40%);
	display: grid;
}

.column:last-of-type {
	place-content: center;
}

.load-more {
	background: transparent;
	color: var(--light);
	font-size: 3em;
	aspect-ratio: 1/1;
	border-radius: 50%;
}

.load-more:hover {
	cursor: pointer;
	color: var(--dark);
	background-color: var(--light);
}
</style>
