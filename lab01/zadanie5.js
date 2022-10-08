let szablon =
    '<table border="{border}">' +
    '  <tr><td>{first}</td><td>{last}</td></tr>' +
    '</table>';

let dane = {
    first: "Jan",
    last: "Kowalski",
    pesel: "97042176329"
};

String.prototype.podstaw = function (data) {
    let text = this.toString()

    Object.keys(data).forEach(e => {
        text = text.replaceAll(`{${e}}`, data[e])
    });
    return text
}

console.log(szablon.podstaw(dane))
// wartość zmiennej szablon sie nie zmienia
console.log(szablon)