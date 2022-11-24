const express = require('express');
const app = express();
const cors = require('cors')
const handlebars = require('express-handlebars');
const path = require('path');
// const sassConfig = require("./sassConfig").use(app);

app.use(cors())

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(require('body-parser').json());

app.use(require('express-session')({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const passportConfig = require("./passportConfig");

passport.use(passportConfig.strategy);
passport.serializeUser(passportConfig.serializeUser);
passport.deserializeUser(passportConfig.deserializeUser);

// socket.io
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Dodajemy usługi REST, które należy zdefiniować w pliku „users.js”
// znajdującym się w podkatalogu „routes”
const users = require('../routes/users');
app.use('/users', users);

const hbs = handlebars.create({
    extname: '.hbs',
    helpers: {
        formatDate(date) { return new Date(date).toLocaleDateString() }
    }
});

//Sets handlebars configurations (we will go through them later on)
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "..", 'views'));

app.get('/login', (_req, res) => res.render('login'));

app.post('/login', passport.authenticate('json', { failWithError: true }),
    // handle error
    function (_err, _req, res, _next) {
        return res.status(401).send();
    },
    function (req, res, _next) {
        return res.status(200).send({ id: req.user._id });
    },
);

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

const viewUsers = require('../routes/viewUsers');
app.use('/', viewUsers);

require('dotenv').config();
const apiPort = process.env.PORT || 3000
const apiHost = process.env.API_HOST || 'localhost';

const dbConnData = {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'lab05'
};

// Do kontaktu z serwerem MongoDB wykorzystamy bibliotekę Mongoose
const mongoose = require('mongoose');

// Łączymy się z bazą MongoDB i jeśli się to uda, uruchamiamy serwer API.
mongoose
    .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(response => {
        console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
        httpServer.listen(apiPort, () => {
            console.log(`API server available from: http://${apiHost}:${apiPort}`);
        });
    })
    .catch(error => console.error('Error connecting to MongoDB', error));

