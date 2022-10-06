const defFun = (fun, types) => {
    return {
        fun,
        typeConstr: types
    }
}

const appFun = (f, ...args) => {
    if (!f.typeConstr) {
        throw ({ typerr: "No typeConstr attribute" });
    }

    if (f.typeConstr.length !== args.length) {
        throw ({
            lenerr: `Number of provided arguments ${args.length} do not match function definition ${f.typeConstr.length}`
        });
    }

    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] !== f.typeConstr[i]) {
            throw ({ typerr: `Wrong type of argument ${i}; expected ${f.typeConstr[i]} got ${typeof args[i]} ` });
        }
    }

    return f.fun(...args)

}

const myfun = defFun((a, b) => a + b, ['number', 'number']);

try {
    console.log(appFun(myfun, 12, 15));
} catch (e) {
    console.log(e.typerr);
}