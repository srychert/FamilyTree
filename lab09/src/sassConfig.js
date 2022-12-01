const path = require('path');
require('dotenv').config();

const use = (app) => {
    if (process.env.NODE_ENV !== 'production') {
        const sass = require("node-sass-middleware");
        app.use(sass({
            src: path.join(__dirname),
            dest: path.join(__dirname, "..", "public"),
            debug: true,
            outputStyle: "compressed",
        }));
    }
}

module.exports = { use };