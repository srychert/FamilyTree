const User = require('../models/User');

// Konfiguracja Passport.js
const serializeUser = (user, done) => done(null, user.id);

const deserializeUser = (id, done) => {
    User.findOne({ "_id": id }, (err, user) => {
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
};

const validateUser = (login, password, done) => {
    User.findOne({ login: login }, (err, user) => {
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

const JsonStrategy = require('passport-json').Strategy;

const strategy = new JsonStrategy({
    usernameProp: 'login',
    passwordProp: 'password'
}, validateUser)

module.exports = { serializeUser, deserializeUser, strategy };