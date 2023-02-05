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

// Get owner of tree
router.get("/", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const login = req.user.login;

	let response = {};
	session
		.run("MATCH (t: Tree {owner: $login})<-[:IN]-(p: Person) Return p", {
			login,
		})
		.then((result) => {
			result.records.forEach((record) => {
				const person = record.get("p");
				response = {
					...person.properties,
					id: person.identity.low,
				};
			});
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
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
		return res.status(400).send(`Fields ${JSON.stringify(emptyFields)} are required`);
	}

	if (!dateIsValid(dateOfBirth)) {
		return res.status(400).send("Wrong date format. Send string yyyy-mm-dd");
	}

	const login = req.user.login;
	let response = {};

	session
		.run(
			`MERGE (t:Tree {name : $treeName})
            ON CREATE
                SET 
                    t.owner = $owner 
                    MERGE (t)<-[:IN]-(p:Person {login: $owner, firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth})
            RETURN p`,
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
				const person = record.get("p");
				response = {
					...person.properties,
					id: person.identity.low,
				};
			});
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		})
		.then(() => {
			session.close();
			return res.send(response);
		});
});

// Get ancestors of level
router.get("/:personId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const personId = parseInt(req.params.personId);
	const level = parseInt(req.query.level);

	if (isNaN(personId) || isNaN(level)) {
		return res.status(400).send("'personId' and 'level' must be an Integer");
	}

	const response = [];
	session
		.run(
			`MATCH (p:Person)-[:PARENT*${level}..${level}]->(c:Person)
			WHERE ID(c) = $personId
			RETURN p`,
			{
				personId,
			}
		)
		.then((result) => {
			result.records.forEach((record) => {
				const person = record.get("p");
				response.push({
					...person.properties,
					id: person.identity.low,
				});
			});
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		})
		.then(() => {
			session.close();
			return res.send(response);
		});
});

// Add parent to person of id === childId
router.post("/:childId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const childId = parseInt(req.params.childId);

	if (isNaN(childId)) {
		return res.status(400).send("'childId' must be an Integer");
	}

	const { firstName, lastName, dateOfBirth } = req.body;

	const emptyFields = Object.entries({ firstName, lastName, dateOfBirth })
		.filter(([_, v]) => v === undefined)
		.map(([k, _]) => k);

	if (emptyFields.length > 0) {
		return res.status(400).send(`Fields ${JSON.stringify(emptyFields)} are required`);
	}

	if (!dateIsValid(dateOfBirth)) {
		return res.status(400).send("Wrong date format. Send string yyyy-mm-dd");
	}

	let response = {};
	session
		.run(
			`MATCH (child:Person)
			WHERE ID(child) = $childId
			MERGE (p:Person {firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth})
			ON CREATE
  				SET p.childId = $childId
			ON MATCH
  				SET p.childId = $childId
			MERGE (p)-[:PARENT]->(child)
			RETURN p`,
			{
				childId,
				firstName,
				lastName,
				dateOfBirth,
			}
		)
		.then((result) => {
			result.records.forEach((record) => {
				const person = record.get("p");
				response = {
					...person.properties,
					id: person.identity.low,
				};
			});
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		})
		.then(() => {
			session.close();
			return res.send(response);
		});
});

router.patch("/:personId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const personId = parseInt(req.params.personId);

	if (isNaN(personId)) {
		return res.status(400).send("'personId' must be an Integer");
	}

	const { firstName, lastName, dateOfBirth } = req.body;

	const emptyFields = Object.entries({ firstName, lastName, dateOfBirth })
		.filter(([_, v]) => v === undefined)
		.map(([k, _]) => k);

	if (emptyFields.length > 0) {
		return res.status(400).send(`Fields ${JSON.stringify(emptyFields)} are required`);
	}

	if (!dateIsValid(dateOfBirth)) {
		return res.status(400).send("Wrong date format. Send string yyyy-mm-dd");
	}

	session
		.run(
			`MATCH (p:Person)
			WHERE ID(p) = $personId
			SET p.firstName = $firstName
			SET p.lastName = $lastName
			SET p.dateOfBirth = $dateOfBirth
			RETURN p`,
			{
				personId,
				firstName,
				lastName,
				dateOfBirth,
			}
		)
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		})
		.then(() => {
			session.close();
			return res.send(200);
		});
});

router.delete("/:personId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const personId = parseInt(req.params.personId);

	if (isNaN(personId)) {
		return res.status(400).send("'personId' must be an Integer");
	}

	session
		.run(
			`MATCH (p:Person)
			WHERE ID(p) = $personId
			DETACH DELETE p`,
			{
				personId,
			}
		)
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		})
		.then(() => {
			session.close();
			return res.send(200);
		});
});

module.exports = router;
