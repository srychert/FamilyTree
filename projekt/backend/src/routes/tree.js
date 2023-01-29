const express = require("express");
const router = express.Router();
const driver = require("../neo4j/neo4jDriver");
const hasRoles = require("../passport/hasRoles");

function dateIsValid(dateStr) {
	const regex = /^\d{4}-\d{2}-\d{2}$/;

	if (dateStr.match(regex) === null) {
		return false;
	}

	const d = new Date(dateStr);
	return d instanceof Date && isFinite(d);
}

// Get all persons from logged in user tree
router.get("/", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const login = req.user.login;

	const response = [];
	session
		.run("MATCH (t: Tree {owner: $login})<-[:IN]-(p: Person) Return p", {
			login,
		})
		.then((result) => {
			result.records.forEach((record) => {
				const person = record.get("p");
				response.push({
					...person.properties,
					id: person.identity,
				});
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

	const emptyFields = Object.entries({ firstName, lastName, dateOfBirth })
		.filter(([_, v]) => v === undefined)
		.map(([k, _]) => k);

	if (emptyFields.length > 0) {
		return res.status(500).send(`Fields ${JSON.stringify(emptyFields)} are required`);
	}

	if (!dateIsValid(dateOfBirth)) {
		return res.status(500).send("Wrong date format. Send string yyyy-mm-dd");
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
