import { defineStore, getActivePinia } from "pinia";
import api from "../api";

export const useTreeStore = defineStore("tree", {
	state: () => ({
		owner: {},
		tree: {},
	}),

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

			this.tree[level] = parents;
		},
		async addParent(childId, level, parent) {
			const res = await api().post(`/tree/${childId}`, parent);
			const newParent = res.data;
			this.tree[level] ? this.tree[level].push(newParent) : (this.tree[level] = [newParent]);
		},
	},
});
