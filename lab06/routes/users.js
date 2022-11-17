const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Pobranie danych wszystkich użytkowników
router.get('/', async (req, res) => {
	try {
		const users = await User.find({});
		return res.send(users);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// Utworzenie nowego użytkownika
router.post('/', async (req, res) => {
	try {
		const { login, password, email, registrationDate } = req.body;
		const user = await User.create({
			login,
			password,
			email,
			registrationDate,
		});
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// Pobranie danych użytkownika o podanym userId
router.get('/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}

});

// Zastąpienie danych użytkownika o podanym userId nowym „kompletem”
router.put('/:userId', async (req, res) => {
	try {
		const id = req.params.userId;
		const { login, email, registrationDate } = req.body;
		const fields = {
			login,
			email,
			registrationDate,
		};
		// make an object only with fields thah have value
		const newUser = Object.fromEntries(Object.entries(fields).filter(([_, v]) => v != null));
		if (Object.keys(fields).length != Object.keys(newUser).length) throw Error("All fields are required to put");
		// new -> true to return the modified document rather than the original. defaults to false
		// upsert -> creates the object if it doesn't exist. defaults to false.
		const user = await User.findByIdAndUpdate(id, newUser, { new: true, upsert: true });
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// Usuniecie użytkownika o podanym userId
router.delete('/:userId', async (req, res) => {
	try {
		const id = req.params.userId;
		const user = await User.findByIdAndDelete(id);
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

// „Unacześnienie” wybranych danych użytkownika o podanym userId
router.patch('/:userId', async (req, res) => {
	try {
		const id = req.params.userId;
		const { login, email, registrationDate } = req.body;
		const fields = {
			login,
			email,
			registrationDate,
		};
		// make an object only with fields thah have value
		const newUser = Object.fromEntries(Object.entries(fields).filter(([_, v]) => v != null));
		// new -> true to return the modified document rather than the original. defaults to false
		// upsert -> creates the object if it doesn't exist. defaults to false.
		const user = await User.findByIdAndUpdate(id, newUser, { new: true, upsert: true });
		return res.send(user);
	} catch (e) {
		console.log(e.message);
		return res.status(500).send(e.message);
	}
});

module.exports = router;
