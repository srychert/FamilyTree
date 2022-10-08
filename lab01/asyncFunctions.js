const addOne = async (x) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(x.length > 0 ? x[0] + 1 : x + 1);
        }, 2000);
    });
}

const double = async (x) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(x.length > 0 ? x[0] * 2 : x * 2);
        }, 1000);
    });
}

module.exports = {
    addOne,
    double
};