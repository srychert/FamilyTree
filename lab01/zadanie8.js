const asyncFunctions = require('./asyncFunctions');

const poKolei = async (fun1, fun2, cb, ...args) => {
    let r1 = await fun1(args)
    let r2 = await fun2(r1)
    return cb(r2);
};

poKolei(asyncFunctions.addOne, asyncFunctions.double, (r) => console.log(r), 10)