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

router.get("/", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const login = req.user.login;
	const { name } = req.query;

	let response = [];
	session
		.run(
			`MATCH (t: Tree)<-[:IN]-(p: Person)
			WHERE t.owner <> $login
			RETURN t, p`,
			{
				login,
			}
		)
		.then((result) => {
			result.records.forEach((record) => {
				const personInDb = record.get("p");
				const treeInDb = record.get("t");

				const person = { ...personInDb.properties, id: personInDb.identity.low };
				const tree = {
					...treeInDb.properties,
					id: treeInDb.identity.low,
					person,
				};

				let dbName = `${person.firstName} ${person.lastName}`.toLocaleLowerCase();
				searchName = name.toLocaleLowerCase();

				if (dbName.includes(searchName) || dbName.split(" ").reverse().join(" ").includes(searchName)) {
					response.push(tree);
				}
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

// Get owner of tree
router.get("/owner", hasRoles("ADMIN", "USER"), async (req, res) => {
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

	const { firstName, lastName, dateOfBirth, gender } = req.body;

	const emptyFields = Object.entries({ firstName, lastName, dateOfBirth, gender })
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
                    MERGE (t)<-[:IN]-(p:Person {login: $owner, active: true, firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth, gender: $gender})
            RETURN p`,
			{
				treeName: `${login}-tree`,
				owner: login,
				firstName,
				lastName,
				dateOfBirth,
				gender,
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

router.get("/person/:personId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const personId = parseInt(req.params.personId);

	if (isNaN(personId)) {
		return res.status(400).send("'personId' must be an Integer");
	}

	let response = {};
	session
		.run(
			`MATCH (p:Person)
			WHERE ID(p) = $personId
			RETURN p`,
			{
				personId,
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

// Add parent to person of id === childId
router.post("/:childId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const childId = parseInt(req.params.childId);

	if (isNaN(childId)) {
		return res.status(400).send("'childId' must be an Integer");
	}

	const { firstName, lastName, dateOfBirth, gender } = req.body;

	const emptyFields = Object.entries({ firstName, lastName, dateOfBirth, gender })
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
			MERGE (p:Person {firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth, gender: $gender, childId: $childId, active: false})
			MERGE (p)-[:PARENT]->(child)
			RETURN p`,
			{
				childId,
				firstName,
				lastName,
				dateOfBirth,
				gender,
			}
		)
		.then((result) => {
			let person = {};
			result.records.forEach((record) => {
				person = record.get("p");
				person = {
					...person.properties,
					id: person.identity.low,
				};

				response = person;
			});

			session
				.run(
					`MATCH (child:Person)<-[:PARENT]-(p:Person {active: true, gender: $gender})
					WHERE ID(child) = $childId
					WITH COUNT(*) AS active_parents
					MATCH (p:Person)
					WHERE ID(p) = $personId AND active_parents < 1
					SET p.active = true
					RETURN p`,
					{
						childId,
						personId: person.id,
						gender,
					}
				)
				.then((r) => {
					r.records.forEach((recordInner) => {
						let updatedPerson = recordInner.get("p");

						response = {
							...updatedPerson.properties,
							id: updatedPerson.identity.low,
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
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		});
});

router.patch("/:personId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const personId = parseInt(req.params.personId);

	if (isNaN(personId)) {
		return res.status(400).send("'personId' must be an Integer");
	}

	const { firstName, lastName, dateOfBirth, gender } = req.body;

	const emptyFields = Object.entries({ firstName, lastName, dateOfBirth, gender })
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
			SET p.gender = $gender
			RETURN p`,
			{
				personId,
				firstName,
				lastName,
				dateOfBirth,
				gender,
			}
		)
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		})
		.then(() => {
			session.close();
			return res.sendStatus(200);
		});
});

router.patch("/active/:prevParentId/:parentId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const prevParentId = parseInt(req.params.prevParentId);
	const parentId = parseInt(req.params.parentId);

	if (isNaN(prevParentId) || isNaN(parentId)) {
		return res.status(400).send("'prevParentId' and 'parentId' must be an Integer");
	}

	session
		.run(
			`OPTIONAL MATCH (previous:Person {active: true})
			WHERE ID(previous) = $prevParentId
			SET previous.active = false
			WITH previous
			MATCH (p:Person {active: false})
			WHERE ID(p) = $parentId
			SET p.active = true
			RETURN previous, p`,
			{
				prevParentId,
				parentId,
			}
		)
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		})
		.then(() => {
			session.close();
			return res.sendStatus(200);
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
			WITH p
			OPTIONAL MATCH (parent:Person)-[:PARENT*1..]->(p)
			DETACH DELETE parent
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
			return res.sendStatus(200);
		});
});

router.patch("/copy/:childId/:parentId", hasRoles("ADMIN", "USER"), async (req, res) => {
	const session = driver.session();
	const childId = parseInt(req.params.childId);
	const parentId = parseInt(req.params.parentId);

	const { parents } = req.body;

	if (isNaN(childId) || isNaN(parentId)) {
		return res.status(400).send("'childId' and 'parentId' must be an Integer");
	}

	let response = [];

	session
		.run(
			`MATCH (child:Person)
			WHERE ID(child) = $childId
			WITH child
			MATCH (p:Person)
			WHERE ID(p) = $parentId
			WITH child, p
			MERGE (parentRoot:Person {childId: $childId, active: false, firstName: p.firstName, lastName: p.lastName, dateOfBirth: p.dateOfBirth, gender: p.gender})-[:PARENT]->(child)
			WITH parentRoot
			UNWIND $parents AS parent
			MERGE (parentCopy:Person {copy: true, firstName: parent.firstName, lastName: parent.lastName, dateOfBirth: parent.dateOfBirth, gender: parent.gender, active: parent.active})
			RETURN parentRoot, parentCopy
		`,
			{
				childId,
				parentId,
				parents,
			}
		)
		.then((result) => {
			let persons = [];
			let parentRoot = {};
			result.records.forEach((record) => {
				parentRoot = record.get("parentRoot");
				parentRoot = {
					...parentRoot.properties,
					id: parentRoot.identity.low,
				};
				let person = record.get("parentCopy");
				person = {
					...person.properties,
					id: person.identity.low,
				};

				persons.push(person);
			});

			response.push(parentRoot);

			persons[0] = { ...persons[0], childId: parentRoot.id };

			const personsWithChilds = persons.reduce((acc, curr, index) => {
				if (index === 0) {
					acc.push(curr);
					return acc;
				}

				curr.childId = acc[index - 1].id;
				acc.push(curr);

				return acc;
			}, []);

			session
				.run(
					`MATCH (child:Person)<-[:PARENT]-(p:Person {active: true, gender: $prGender})
					WHERE ID(child) = $childId
					WITH COUNT(p) AS active_parents
					OPTIONAL MATCH (pR:Person)
					WHERE ID(pR) = $prId AND active_parents < 1
					SET pR.active = true
					WITH pR
					UNWIND $personsWithChilds AS parent
						MATCH (p:Person)
						WHERE ID(p) = parent.id
						REMOVE p.copy
						SET p.childId = parent.childId
						WITH p
						MATCH (child:Person)
						WHERE ID(child) = p.childId
						MERGE (p)-[:PARENT]->(child)
						RETURN p`,
					{
						childId,
						personsWithChilds,
						prId: parentRoot.id,
						prGender: parentRoot.gender,
					}
				)
				.then((r) => {
					r.records.forEach((recordInner) => {
						let updatedPerson = recordInner.get("p");

						updatedPerson = {
							...updatedPerson.properties,
							id: updatedPerson.identity.low,
						};
						response.push(updatedPerson);
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
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send(error);
		});
});

module.exports = router;
