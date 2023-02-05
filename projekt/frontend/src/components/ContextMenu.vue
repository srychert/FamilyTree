<script setup>
import { ref, computed } from "vue";
import { useTreeStore } from "@/stores/tree";
import MenuAside from "@/components/MenuAside.vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const treeStore = useTreeStore();

const isOpen = ref(false);
const clientX = ref("0px");
const clientY = ref("0px");

const lastClick = ref(null);
const level = ref(null);
const person = ref({});
const parents = ref([]);

const items = computed(() => [
	level.value != 0
		? {
				content: "Change person",
				action: () => {},
				aside: {
					items: parents.value.map((p) => {
						return {
							content: `${p.firstName} ${p.lastName}\n${p.dateOfBirth}`,
							args: [level.value, p.childId, person.value.id, p.id],
						};
					}),
					action: (args) => {
						// level, childId, previousParentId, parentId
						treeStore.setParentAsActive(...args);
						isOpen.value = false;
					},
				},
		  }
		: null,
	{
		content: "Add parent",
		action: () => {
			router.push({ name: "add-parent", query: { childId: person.value.id, level: level.value } });
		},
	},
	{
		content: "Edit",
		action: () => {
			router.push({ name: "edit-person", query: { personId: person.value.id, level: level.value } });
		},
	},
	{
		content: "Delete",
		action: () => {
			treeStore.deletePerson(person.value.id).then((_) => router.go());
		},
	},
]);

const toggle = (e, treeLevel, parent, otherParents) => {
	e.preventDefault();

	level.value = treeLevel;
	person.value = parent;
	parents.value = otherParents;

	clientX.value = `${e.clientX}px`;
	clientY.value = `${e.clientY}px`;

	if (lastClick.value == e.currentTarget) {
		isOpen.value = !isOpen.value;
		return;
	} else {
		isOpen.value = true;
	}

	lastClick.value = e.currentTarget;
};

defineExpose({
	toggle,
});
</script>

<template>
	<div v-if="isOpen" id="context-menu" class="context-menu">
		<template v-for="item in items">
			<div class="item-wrapper" v-if="item" :class="{ 'has-aside': item.aside }">
				<div class="item" @click="item.action">{{ item.content }}</div>
				<MenuAside v-if="item.aside">
					<div v-for="asideItem in item.aside.items" @click="item.aside.action(asideItem?.args)">
						<div style="border-bottom: 1px solid">{{ asideItem.content }}</div>
					</div>
				</MenuAside>
			</div>
		</template>
	</div>
</template>

<style scoped>
.context-menu {
	padding: 1rem;
	color: var(--dark);
	background-color: white;
	border-radius: 8px;
	border: 1px solid black;

	position: fixed;
	top: v-bind(clientY);
	left: v-bind(clientX);
	z-index: 999;
}

.item-wrapper {
	box-sizing: content-box;
	display: grid;
	gap: 8px;
	max-height: 2rem;
	padding: 0.5em 1em;
	border-radius: 8px;
}
.has-aside {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

.item {
	user-select: none;
	cursor: pointer;
}

.item-wrapper:hover {
	color: var(--light);
	background-color: black;
}

.item-wrapper:hover > .aside {
	visibility: visible;
}
</style>
