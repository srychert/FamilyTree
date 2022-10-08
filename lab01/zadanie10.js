const asyncFunctions = require('./asyncFunctions');

const poKoleiTab = async (funTab, cb, ...args) => {
    let r = args;
    for (const fun of funTab) {
        r = await fun(r)
    }

    return cb(r)
};

poKoleiTab([asyncFunctions.addOne, asyncFunctions.double], (r) => console.log(r), 10)