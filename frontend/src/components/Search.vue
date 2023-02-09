<script setup>
import { ref, onUnmounted } from "vue";
import { useTreeStore } from "@/stores/tree";
import { useUserStore } from "@/stores/user";

const props = defineProps({
	currentMaxLevel: Number,
	copyMode: Boolean,
});

const treeStore = useTreeStore();
const userStore = useUserStore();

const name = ref("");
const showNoResults = ref(false);
let timer = undefined;

const handelSearch = () => {
	clearTimeout(timer);
	showNoResults.value = false;

	if (name.value === "") {
		treeStore.trees = [];
		return;
	}

	timer = setTimeout(() => {
		treeStore.searchForTrees(name.value).then((_) => (showNoResults.value = true));
	}, 500);
};

const emit = defineEmits(["selectTree", "update:copyMode"]);
const selectedTree = ref(null);

const showTree = (tree) => {
	selectedTree.value = tree;
	emit("selectTree", tree);
	treeStore.tree = {};
	treeStore.owner = tree.person;
	treeStore.tree[0] = [treeStore.owner];
	for (let i = 1; i < props.currentMaxLevel; i++) {
		treeStore.getParents(tree.person.id, i);
	}

	name.value = "";
};

const handelCopy = () => {
	emit("update:copyMode", true);
};

const handelCopyCancel = () => {
	emit("update:copyMode", false);
	treeStore.copy = [];
};

const handelCopyConfirm = () => {
	emit("update:copyMode", false);
	treeStore.getOwner().then((_) => {
		if (treeStore.owner.id !== undefined) {
			for (let i = 1; i < props.currentMaxLevel; i++) {
				treeStore.getParents(treeStore.owner.id, i);
			}
		}
	});
};

onUnmounted(() => {
	treeStore.trees = [];
});
</script>

<template>
	<div class="search">
		<div class="actions">
			<input v-model="name" type="text" @input="handelSearch" />
			<button v-if="selectedTree && userStore.user.login !== selectedTree?.person?.login && !copyMode" @click="handelCopy">
				<span>Copy</span>
				<span class="material-symbols-outlined"> content_copy </span>
			</button>
			<div v-if="copyMode" class="copy-buttons">
				<button @click="handelCopyConfirm">OK</button>
				<button @click="handelCopyCancel">Cancel</button>
			</div>
		</div>

		<div v-if="name !== ''" class="trees">
			<div v-if="treeStore.trees.length === 0 && showNoResults" class="tree-owner">No results</div>
			<div class="tree-owner" v-for="tree in treeStore.trees" @click="showTree(tree)">
				<div>{{ tree.person.firstName }} {{ tree.person.lastName }}</div>
				<div>{{ tree.person.dateOfBirth }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.search {
	margin-left: 4px;
	display: flex;
	max-width: 600px;
}

.actions {
	flex: 1;
	display: grid;
	gap: 4px;
	grid-template-columns: 66.66% 33.33%;
}

input {
	z-index: 2;
}

button {
	outline: auto;
	outline: none;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
}

.copy-buttons {
	display: grid;
	grid-template-columns: 1fr 1fr;
}

.trees {
	width: 66.66%;
	position: absolute;
	top: 42px;
	z-index: 1;
}

.tree-owner {
	background-color: var(--light);
	color: var(--dark);
	padding: 0.5rem 1rem;
	user-select: none;
	cursor: pointer;
	border-top: 1px solid;
}

.tree-owner:hover {
	background-color: black;
	color: var(--light);
}

@media screen and (max-width: 600px) {
	.actions {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
	}

	input {
		grid-row: 2;
	}

	button {
		grid-row: 1;
	}

	.trees {
		width: 100%;
		top: 87px;
	}
}
</style>
