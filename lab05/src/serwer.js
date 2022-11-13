const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const axios = require('axios');

const sass = require("node-sass-middleware");

app.use(sass({
    src: path.join(__dirname),
    dest: path.join(__dirname, "..", "public"),
    debug: true,
    outputStyle: "compressed",
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

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


app.get('/', async (req, res) => {
    const users = await axios.get(`http://${apiHost}:${apiPort}/users`).then(r => r.data).catch(e => console.log(e))
    res.render('index', {
        users,
    });
});

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

