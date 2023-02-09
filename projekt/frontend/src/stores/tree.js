import { defineStore, getActivePinia } from "pinia";
import api from "../api";

export const useTreeStore = defineStore("tree", {
	state: () => ({
		owner: {},
		tree: {},
		trees: [],
		copy: [],
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

					if (parents.length === 1) {
						parents[0].gender === "male" ? parents.push(null) : parents.unshift(null);
					} else {
						parents.sort((p, _) => (p?.gender === "male" ? -1 : 1));
					}

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
				const currentGender = state.tree[level][childId].find((p) => p.id === parentId)?.gender;
				return state.tree[level][childId].filter((p) => p.id !== parentId && !p.active && p.gender === currentGender);
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
		async searchForTrees(name) {
			const res = await api().get(`/tree`, { params: { name } });
			this.trees = res.data;
		},
		async getOwner() {
			const res = await api().get(`/tree/owner`);
			const owner = res.data;

			this.owner = owner;
			this.tree[0] = [owner];
		},
		async getParents(personId, level) {
			const res = await api().get(`/tree/${personId}?level=${level}`);
			const parents = res.data;

			const parentsByChildId = parents.reduce((acc, parent) => {
				const newAcc = acc[parent.childId] ? { ...acc, [parent.childId]: [...acc[parent.childId], parent] } : { ...acc, [parent.childId]: [parent] };

				return newAcc;
			}, {});

			this.tree[level] = parentsByChildId;
		},
		async getPerson(personId) {
			const res = await api().get(`/tree/person/${personId}`);
			return res.data;
		},
		async addParent(childId, parent) {
			await api().post(`/tree/${childId}`, parent);
		},
		async editPerson(personId, person) {
			await api().patch(`/tree/${personId}`, person);
		},
		async deletePerson(level, childId, person) {
			const res = await api().delete(`/tree/${person.id}`);

			if (res.status !== 200) {
				return;
			}

			console.log("OK");

			if (level == 0) {
				this.owner = {};
				this.tree = {};
				return;
			}

			this.tree[level][childId] = this.tree[level][childId].filter((p) => p.id !== person.id);

			const newActivePerson = this.tree[level][childId].find((p) => p.gender === person.gender && !p.active);

			if (newActivePerson) {
				this.setParentAsActive(level, childId, person.id, newActivePerson.id, true);
			}
		},
		async setParentAsActive(level, childId, previousParentId, parentId, callApi) {
			const indexPrev = this.tree[level][childId].findIndex((parent) => parent.id == previousParentId);
			const parents = this.tree[level][childId];

			if (parents[indexPrev]) parents[indexPrev].active = false;

			const indexNew = this.tree[level][childId].findIndex((parent) => parent.id == parentId);
			if (parents[indexNew]) parents[indexNew].active = true;

			if (callApi) await api().patch(`/tree/active/${previousParentId}/${parentId}`);
		},
		toggleCopy(person) {
			const index = this.copy.indexOf(person);

			if (index > -1) {
				this.copy.splice(index, 1);
				return;
			}

			this.copy.push(person);
		},
		async doCopy(childId, parentId, parents) {
			const res = await api().patch(`/tree/copy/${childId}/${parentId}`, { parents }, { timeout: 3000 });

			console.log(res);
		},
	},
});
