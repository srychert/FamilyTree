import axios from "axios";

export default () => {
	const instance = axios.create({
		baseURL: "http://localhost:5000/",
		timeout: 1000,
		headers: { "Content-Type": "application/json" },
		withCredentials: true,
	});

	return instance;
};
