<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useTreeStore } from "@/stores/tree";
import CreateTreeForm from "@/components/CreateTreeForm.vue";
import Person from "@/components/Person.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import Search from "@/components/Search.vue";

const treeStore = useTreeStore();
// 2*currentMaxLevel = number of parent nodes in column
const currentMaxLevel = ref(Object.keys(treeStore.tree).length || 4);
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

const copyMode = ref(false);
const ownerMenu = ref(true);

const handelPersonClick = (e, level, person) => {
	if (copyMode.value) {
		treeStore.toggleCopy(person);
		return;
	}

	const others = level != 0 ? treeStore.getOtherParents(level, person.childId, person.id) : [];
	contextMenuRef.value.toggle(e, level, person, others);
};

onUnmounted(() => {
	// I am not sure if user wants the tree to reset
	// treeStore.tree = {};

	treeStore.copy = [];
});
</script>

<template>
	<CreateTreeForm v-if="Object.keys(treeStore.owner).length === 0" />

	<div v-else>
		<Search :currentMaxLevel="currentMaxLevel" v-model:copyMode="copyMode" @selectTree="() => (ownerMenu = false)"></Search>
		<div class="tree">
			<div class="column" v-for="(parents, level) in treeStore.getActive" :style="`grid-template-rows: repeat(${2 ** Number.parseInt(level)}, minmax(0, 1fr))`">
				<template v-for="person in parents">
					<Person v-if="person?.active" :person="person" @click="(e) => handelPersonClick(e, level, person)" :class="{ 'to-copy': treeStore.copy.includes(person) }" />
					<Person v-else v-if="level != 0" :person="{}" />
				</template>
			</div>
			<div class="column">
				<button class="load-more material-symbols-outlined" @click="handelLoadNextLevel">add_circle</button>
			</div>
		</div>
	</div>

	<ContextMenu :ownerMenu="ownerMenu" ref="contextMenuRef"></ContextMenu>
</template>

<style scoped>
.tree {
	height: calc(100vh - 82px);
	padding: 5px;
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

.to-copy {
	background-color: black;
}
</style>
