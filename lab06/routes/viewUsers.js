const express = require('express');
const router = express.Router();

const User = require('../models/User');

const loggedIn = require("../src/loggedIn");

router.get('/', async (req, res) => {
    const users = await User.find({}).lean();
    res.render('index', {
        users,
        loggedIn: req.isAuthenticated(),
    });
});

router.get('/new', loggedIn, (req, res) => {
    console.log(req.user)
    console.log(req.isAuthenticated())
    res.render('new', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
})

router.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).lean();
    res.render('user', {
        user
    });
})

module.exports = router;