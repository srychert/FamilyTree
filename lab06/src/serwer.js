const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
    // const sass = require("node-sass-middleware");
    // app.use(sass({
    //     src: path.join(__dirname),
    //     dest: path.join(__dirname, "..", "public"),
    //     debug: true,
    //     outputStyle: "compressed",
    // }));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(require('body-parser').urlencoded({
    extended: false
}));

app.use(require('express-session')({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

const User = require('../models/User');

const passport = require('passport');
const passportLocal = require('passport-local');
app.use(passport.initialize());
app.use(passport.session());

// Konfiguracja Passport.js
const validateUser = (login, password, done) => {
    User.findOne({login: login}, (err, user) => {
        if (err) {
            done(err);
        }
        if (user) {
            // if (user.password === HASH(password)) {
            // dla ułatwienia hasła będą w „plain text” (nie używać „produkcyjnie”!)
            if (user.password === password) {
                done(null, user);
            } else {
                done(null, null);
            }
        } else {
            done(null, null);
        }
    });
};
// instalujemy dwa „middleware" Passport.js
passport.use(new passportLocal.Strategy(validateUser));

passport.serializeUser( (user, done) => done(null, user.id) );
passport.deserializeUser( (id, done) => {
    User.findOne({"_id": id}, (err, user) => {
        if (err) {
            done(err);
        }
        if (user) {
            done(null, {
                id: user._id,
                login: user.login,
                password: user.password
            });
        } else {
            done({
                msg: 'Nieznany ID'
            });
        }
    });
});

// Dodajemy usługi REST, które należy zdefiniować w pliku „users.js”
// znajdującym się w podkatalogu „routes”
const users = require('../routes/users');
app.use('/users', users);

require('dotenv').config();
const apiPort = process.env.PORT || 3000
const apiHost = process.env.API_HOST || 'localhost';

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    extname: '.hbs',
    helpers: {
        formatDate(date) { return new Date(date).toLocaleDateString() }
    }
});

//Sets handlebars configurations (we will go through them later on)
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "..", 'views'));

app.get('/login', (_req, res) => res.render('login') );

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), (_req, res) => res.redirect('/') );

app.get('/logout', (req, res, next) => {
    req.logout( (err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/', async (req, res) => {
    const users = await axios.get(`http://${apiHost}:${apiPort}/users`).then(r => r.data).catch(e => console.log(e))
    res.render('index', {
        users,
    });
});

app.get('/new-user', async (req, res) => {
    console.log(req.user)
    console.log(req.isAuthenticated())
    res.render('new', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
})

app.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const user = await axios.get(`http://${apiHost}:${apiPort}/users/${id}`).then(r => r.data).catch(e => console.log(e))
    res.render('user', {
        user
    });
})

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
        app.listen(apiPort, () => {
            console.log(`API server available from: http://${apiHost}:${apiPort}`);
        });
    })
    .catch(error => console.error('Error connecting to MongoDB', error));

