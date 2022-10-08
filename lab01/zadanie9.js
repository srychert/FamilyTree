const asyncFunctions = require('./asyncFunctions');

const razem = async (fun1, fun2, cb, ...args) => {
    let r = await Promise.all([fun1(args), fun2(args)])
    return cb(r)
};

razem(asyncFunctions.addOne, asyncFunctions.double, (r) => console.log(r), 10)
