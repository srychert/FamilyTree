const groupMap = (tab, key, fun) => {
    let result = { true: [], false: [] }
    tab.forEach(e => {
        if (key(e)) {
            result.true.push(fun(e))
        } else {
            result.false.push(fun(e))
        }
    });

    return result
}

// { true => [3,5,5], false => [4,4] }
console.log(groupMap([3, 2, 4, 4, 3], n => n % 2 === 0, n => n + 1))