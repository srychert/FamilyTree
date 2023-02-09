const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const hasRoles = require("../passport/hasRoles");
const isOwner = require("../passport/isOwner");

const checkPassword = (password) => {
	if (typeof password !== "string") {
		throw Error("Provide string password");
	}
};

// Get all
router.get("/", hasRoles("ADMIN", "USER"), async (req, res) => {
	try {
		const users = await User.find({});
		return res.send(users);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// New User
router.post("/", async (req, res) => {
	try {
		const { login, password } = req.body;
		checkPassword(password);

		const user = await User.create({
			login,
			password: bcrypt.hashSync(password, 12),
			registrationDate: new Date(),
			role: "USER",
		});
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// Get by id
router.get("/:userId", hasRoles("ADMIN", "USER"), isOwner, async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// Update user
router.put("/:userId", hasRoles("ADMIN", "USER"), isOwner, async (req, res) => {
	try {
		const id = req.params.userId;
		const { login, password } = req.body;

		const fields = {
			login,
			password,
		};

		const emptyFields = Object.entries(fields)
			.filter(([_, v]) => v === undefined)
			.map(([k, _]) => k);

		if (emptyFields.length > 0) {
			throw Error(`Fields ${JSON.stringify(emptyFields)} are required to put`);
		}

		checkPassword(password);
		const userInDb = await User.findById(id);
		const updatedUser = {
			...fields,
			password: bcrypt.hashSync(password, 12),
			role: userInDb.role,
			registrationDate: userInDb.registrationDate,
		};

		// new -> true to return the modified document rather than the original. defaults to false
		// upsert -> creates the object if it doesn't exist. defaults to false.
		const user = await User.findByIdAndUpdate(id, updatedUser, { new: true, upsert: true, runValidators: true });
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// Delete user
router.delete("/:userId", hasRoles("ADMIN", "USER"), isOwner, async (req, res) => {
	try {
		const id = req.params.userId;
		const user = await User.findByIdAndDelete(id);
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// Update user fields that are send with the request
router.patch("/:userId", hasRoles("ADMIN", "USER"), isOwner, async (req, res) => {
	try {
		const id = req.params.userId;
		const { login, password } = req.body;

		const fields = {
			login,
			password: password
				? (() => {
						checkPassword(password);
						return bcrypt.hashSync(password, 12);
				  })()
				: undefined,
		};
		// make an object only with fields that have value
		const updatedUser = Object.fromEntries(Object.entries(fields).filter(([_, v]) => v !== undefined));
		// new -> true to return the modified document rather than the original. defaults to false
		// upsert -> creates the object if it doesn't exist. defaults to false.
		const user = await User.findByIdAndUpdate(id, updatedUser, { new: true, upsert: false, runValidators: true });
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

router.patch("/:userId/role", hasRoles("ADMIN"), async (req, res) => {
	try {
		const id = req.params.userId;
		const { role } = req.body;

		if (!role || role === "") {
			throw Error("Role can not be empty");
		}

		const userInDb = await User.findById(id);
		userInDb.role = role;

		const user = await User.findByIdAndUpdate(id, userInDb, { new: true, upsert: false, runValidators: true });
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

module.exports = router;
