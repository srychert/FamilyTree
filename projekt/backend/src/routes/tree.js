const { response } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const driver = require("../neo4j/neo4jDriver");
const hasRoles = require("../passport/hasRoles");

// Get all
router.get("/", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();

	console.log(req.user.login);

	const response = [];
	session
		.run("MATCH (t: Tree) Return t")
		.then((result) => {
			result.records.forEach((record) => {
				response.push(record.get("t"));
			});
		})
		.catch((error) => {
			console.log(error);
		})
		.then(() => {
			session.close();
			return res.send(response);
		});
});

// New Tree
router.post("/", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();

	const { firstName, lastName, dateOfBirth } = req.body;

	if ([firstName, lastName, dateOfBirth].some((e) => e === undefined)) {
		return res.status(500).send("Provide all fields");
	}

	const login = req.user.login;

	let tree = {};

	session
		.run(
			`MERGE (t:Tree {name : $treeName})
            ON CREATE
                SET 
                    t.owner = $owner 
                    MERGE (t)<-[:IN]-(p:Person {login: $owner, firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth})
            RETURN t`,
			{
				treeName: `${login}-tree`,
				owner: login,
				firstName,
				lastName,
				dateOfBirth,
			}
		)
		.then((result) => {
			result.records.forEach((record) => {
				tree = record.get("t");
				console.log(tree);
			});
		})
		.catch((error) => {
			console.log(error);
		})
		.then(() => {
			session.close();
			return res.send(tree);
		});
});

module.exports = router;
