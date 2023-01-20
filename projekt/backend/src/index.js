const express = require("express");
const app = express();
const cors = require("cors");

// load .env
require("dotenv").config();

const corsOptions = {
	origin: true, //To allow requests from client
	credentials: true,
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(require("body-parser").json());

app.use(
	require("express-session")({
		secret: process.env.SECRET || "$ecret",
		resave: false,
		saveUninitialized: false,
	})
);

const httpServer = require("http").createServer(app);

// passport config
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
const passportConfig = require("./passport/passportConfig");
passport.use(passportConfig.strategy);
passport.serializeUser(passportConfig.serializeUser);
passport.deserializeUser(passportConfig.deserializeUser);

const io = require("socket.io")(httpServer, {
	cors: {
		origin: true,
		credentials: true,
	},
});

io.on("connect", (socket) => {
	console.log(`new connection ${socket.id}`);
	console.log(socket.request.user);

	socket.on("msg", (msg) => {
		console.log(msg);
		io.emit("broadcast", "lol");
	});

	// const session = socket.request.session;
	// console.log(`saving sid ${socket.id} in session ${session.id}`);
	// session.socketId = socket.id;
	// session.save();
});

// mongodb config
const PORT = process.env.PORT || 5000;
const dbConnData = {
	host: process.env.MONGO_HOST || "127.0.0.1",
	port: process.env.MONGO_PORT || 27017,
	database: process.env.MONGO_DATABASE || "users",
};

const mongoose = require("mongoose");
// Set `strictQuery` to `false` to prepare for the change to Mongoose 7
mongoose.set("strictQuery", false);

// use routes
const users = require("./routes/users");
app.use("/users", users);
const auth = require("./routes/auth");
app.use("/", auth);

// connect to mongodb
mongoose
	.connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`)
	.then((response) => {
		console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`);
	})
	.catch((error) => console.error("Error connecting to MongoDB", error));

// connect to neo4j
try {
	require("./neo4j/neo4jDriver");
	console.log(`Connected to Neo4J.`);
} catch (ex) {
	console.error("Error connecting to Neo4J", ex);
}

httpServer.listen(PORT, () => {
	console.log(`API server listening on port ${PORT}`);
});
