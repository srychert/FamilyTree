const asyncFunctions = require('./asyncFunctions');

const razem = async (funTab, cb, ...args) => {
    let r = await Promise.all(funTab.map(async (fun) => await fun(args)));
    return cb(r)
};

razem([asyncFunctions.addOne, asyncFunctions.double], (r) => console.log(r), 10)