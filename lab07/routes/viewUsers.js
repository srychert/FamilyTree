const express = require('express');
const router = express.Router();

const User = require('../models/User');
const isAdmin = require('../src/isAdmin');
const loggedIn = require("../src/loggedIn");

router.get('/', loggedIn, isAdmin, async (req, res) => {
    const users = await User.find({}).lean();
    res.render('index', {
        users,
        loggedIn: req.isAuthenticated(),
    });
});

router.get('/new', loggedIn, isAdmin, (req, res) => {
    res.render('new');
})

router.get('/user/:id', loggedIn, async (req, res) => {
    const id = req.params.id;
    const idAuth = req.user.id.toString();

    const userData = await User.findById(id).lean();
    const user = await User.findById(idAuth);

    const owns = id === idAuth

    if (owns || (user.role === "ADMIN" && userData.role != "ADMIN")) {
        res.render('user', {
            user: userData
        });
    } else {
        res.render('login')
    }

})

router.get('/chat', loggedIn, (req, res) => {
    res.render('chat', {
        login: req.user.login
    });
});

module.exports = router;