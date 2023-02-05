import { defineStore, getActivePinia } from "pinia";
import api from "../api";

export const useTreeStore = defineStore("tree", {
	state: () => ({
		owner: {},
		tree: {},
	}),

	getters: {
		getActive(state) {
			let active = {};
			let prevPositions = {};

			for (const [level, persons] of Object.entries(state.tree)) {
				const currentParents = Array.from(Array(2 ** level));

				if (level == 0) {
					active[level] = persons;
					prevPositions = { [persons[0].id]: 0 };
					continue;
				}

				let newPrevPositions = {};

				for (const [childId, position] of Object.entries(prevPositions)) {
					// get active parents
					const parents = state.tree[level][childId] ? state.tree[level][childId].filter((p) => p.active) : [];

					// add active parents or undefined to currentParents array at calculated positions
					for (let i = 0; i < 2; i++) {
						const pos = position * 2 + i;
						currentParents[pos] = parents[i];

						if (parents[i]) {
							newPrevPositions[parents[i].id] = pos;
						}
					}
				}

				active[level] = currentParents;
				prevPositions = newPrevPositions;
			}

			return active;
		},

		getOtherParents(state) {
			return (level, childId, parentId) => {
				return state.tree[level][childId].filter((p) => p.id !== parentId && !p.active);
			};
		},
	},

	actions: {
		async createTree(ownerData) {
			const res = await api().post(`/tree`, ownerData);
			const owner = res.data;

			this.owner = owner;
			this.tree[0] = [{ ...owner, active: true }];
		},
		async getOwner() {
			const res = await api().get(`/tree`);
			const owner = res.data;

			this.owner = owner;
			this.tree[0] = [{ ...owner, active: true }];
		},
		async getParents(personId, level) {
			const res = await api().get(`/tree/${personId}?level=${level}`);
			const parents = res.data;

			const parentsByChildId = parents.reduce((acc, parent) => {
				const newAcc = acc[parent.childId] ? { ...acc, [parent.childId]: [...acc[parent.childId], { ...parent, active: false }] } : { ...acc, [parent.childId]: [{ ...parent, active: true }] };

				if (newAcc[parent.childId][1]) {
					newAcc[parent.childId][1].active = true;
				}

				return newAcc;
			}, {});

			this.tree[level] = parentsByChildId;
		},
		async addParent(childId, parent) {
			await api().post(`/tree/${childId}`, parent);
		},
		async editPerson(personId, person) {
			await api().patch(`/tree/${personId}`, person);
		},
		async deletePerson(personId) {
			await api().delete(`/tree/${personId}`);
		},
		setParentAsActive(level, childId, previousParentId, parentId) {
			const indexPrev = this.tree[level][childId].findIndex((parent) => parent.id == previousParentId);
			this.tree[level][childId][indexPrev].active = false;

			const indexNew = this.tree[level][childId].findIndex((parent) => parent.id == parentId);
			this.tree[level][childId][indexNew].active = true;
		},
	},
});
