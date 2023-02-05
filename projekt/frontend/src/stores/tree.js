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
			let prev = [];
			for (const [level, persons] of Object.entries(state.tree)) {
				if (level == 0) {
					active[level] = persons;
					prev = [persons[0].id];
					continue;
				}

				let newPrev = [];

				// console.log(prev);

				let i = 100;

				const newLevel = prev.reduce((acc, curr, index) => {
					console.log(level, curr);
					let parents = persons[curr] ? persons[curr].filter((p) => p.active) : [];

					while (parents.length < 2) {
						parents.push(null);
					}

					newPrev = [...newPrev, ...parents.map((p) => p?.id)];

					// console.log("newPrev", newPrev);
					// console.log("parents", parents);

					if (curr) {
						acc[curr] = parents;
					}
					// else {
					// 	acc[i++] = [null, null];
					// 	console.log(acc);
					// }

					return acc;
				}, {});

				// console.log(newPrev);

				active[level] = newLevel;

				prev = newPrev;
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
			this.tree[0] = [owner];
		},
		async getOwner() {
			const res = await api().get(`/tree`);
			const owner = res.data;

			this.owner = owner;
			this.tree[0] = [owner];
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
		async deletePerson(personId) {
			const res = await api().delete(`/tree/${personId}`);
		},
		setParentAsActive(level, childId, previousParentId, parentId) {
			const indexPrev = this.tree[level][childId].findIndex((parent) => parent.id == previousParentId);
			this.tree[level][childId][indexPrev].active = false;

			const indexNew = this.tree[level][childId].findIndex((parent) => parent.id == parentId);
			this.tree[level][childId][indexNew].active = true;
		},
	},
});
