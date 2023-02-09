import axios from "axios";

export default () => {
	const instance = axios.create({
		baseURL: import.meta.env.VITE_API  || "http://localhost:5000",
		timeout: 1000,
		headers: { "Content-Type": "application/json" },
		withCredentials: true,
	});

	return instance;
};
