const arr = [
    {
        id: 'abc',
        name: 'Ala'
    },
    {
        id: 'def',
        name: 'Tomek'
    },
    {
        id: 'ghi',
        name: 'Jan'
    }
]

const objWithId = arr.reduce((prev, curr) => {
    prev[curr.id] = curr;
    return prev;
}, {})

console.log(objWithId)