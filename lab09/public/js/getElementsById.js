const getElementsById = (...ids) => {
    return ids.reduce((result, id) => {
        result[id] = document.getElementById(id);
        return result;
    }, {})
}