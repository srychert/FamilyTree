// moduł TCP – jako „podstawa serwera aplikacji”
const net = require("net");
const getGameOptions = require("./getGameOptions");

// parametr – ewentualnie przekazywany poprzez zmienną środowiskową
const port = process.env.PORT || 3000;

// tworzymy i konfigurujemy obiekt aplikacji
const app = net.createServer();

app.on('connection', (socket) => {
    socket.onGoing = false
    socket.optionsConfigured = false

    socket.write("Specify game options (leave blank for defaults eg. 5,,10)\n")
    const gameOptions = getGameOptions()
    socket.write(`Size[${gameOptions.size}], Dimension[${gameOptions.dimension}], Maximum[${gameOptions.maximum}]: `)

    // implementacja gry
    socket.on('data', (data) => {
        msg = data.toString().replace('\n', '')

        if (!socket.optionsConfigured) {

            (function () {
                if (msg === '') {
                    socket.optionsConfigured = true
                    return
                }

                options = msg.split(',')

                if (options.length !== 3) {
                    socket.write('wrong format\n')
                    return
                }

                try {
                    optionsList = options.map(option => parseInt(option.trim()))
                } catch {
                    socket.write('wrong options data')
                    return
                }

                gameOptions.size = isNaN(optionsList[0]) ? gameOptions.size : optionsList[0]
                gameOptions.dimension = isNaN(optionsList[1]) ? gameOptions.dimension : optionsList[1]
                gameOptions.maximum = isNaN(optionsList[2]) ? gameOptions.maximum : optionsList[2]
                socket.optionsConfigured = true
            })();
        }

        if (socket.optionsConfigured) {
            console.log(gameOptions)
            socket.onGoing = true
        }

        if (socket.onGoing) {
            // game logic here
            console.log(gameOptions)
        }
    })
})


// uruchamiamy serwer gry
app.listen(port, () => {
    console.log(`Serwer gry dostępny na porcie ${port}`);
});
