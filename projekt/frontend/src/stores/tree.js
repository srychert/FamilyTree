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

				const newLevel = prev.reduce((acc, curr) => {
					if (!persons[curr]) {
						return acc;
					}

					let parents = persons[curr].filter((p) => p.active);
					newPrev = [...parents.map((p) => p.id), ...newPrev];

					acc[curr] = parents;
					return acc;
				}, {});

				active[level] = newLevel;
				prev = newPrev;
			}

			return active;
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
				const newAcc = acc[parent.childId] ? { ...acc, [parent.childId]: [...acc[parent.childId], { ...parent, active: false }] } : { ...acc, [parent.childId]: [{ ...parent, active: false }] };

				// ugly but works
				if (newAcc[parent.childId].length === 1) {
					newAcc[parent.childId][0].active = true;
				}
				if (newAcc[parent.childId].length === 2) {
					newAcc[parent.childId][1].active = true;
				}
				return newAcc;
			}, {});

			this.tree[level] = parentsByChildId;
		},
		async addParent(childId, level, parent) {
			const res = await api().post(`/tree/${childId}`, parent);
			const newParent = res.data;
			this.tree[level] ? this.tree[level].push(newParent) : (this.tree[level] = [newParent]);
		},
		setParentAsActive(level, childId, previousParentId, parentId) {
			const indexPrev = this.tree[level][childId].findIndex((parent) => parent.id == previousParentId);
			this.tree[level][childId][indexPrev].active = false;

			const indexNew = this.tree[level][childId].findIndex((parent) => parent.id == parentId);
			this.tree[level][childId][indexNew].active = true;

			console.log(this.tree[level][childId]);
		},
	},
});
