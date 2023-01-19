# Backend

## Run docker db
`docker run --name mongo -p 27017:27017 -d mongo`
`docker run --name neo4j-server -p7474:7474 -p7687:7687 -d -e NEO4J_AUTH=neo4j/secret1234 neo4j`