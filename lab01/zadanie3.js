const groupBy = (tab, key) => {
    let result = { true: [], false: [] }
    tab.forEach(e => {
        if (key(e)) {
            result.true.push(e)
        } else {
            result.false.push(e)
        }
    });

    return result
}

console.log(groupBy([3, 2, 4, 4, 3], n => n % 2 === 0))