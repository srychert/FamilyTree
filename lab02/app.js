// moduł TCP – jako „podstawa serwera aplikacji”
import { createServer } from "net";

import { getGameOptions } from "./getGameOptions.js";
import { confiugreGame } from "./configureGame.js";
import { game, generateSequence } from "./game.js";

// parametr – ewentualnie przekazywany poprzez zmienną środowiskową
const port = process.env.PORT || 3000;

// tworzymy obiekt aplikacji
const app = createServer();

// implementacja gry
app.on('connection', (socket) => {
    socket.optionsConfigured = false
    socket.gameGenerated = false
    socket.onGoing = false

    socket.write("Specify game options (leave blank for defaults eg. 5,,10)\n")
    let gameOptions = getGameOptions();
    let gameSequence;
    socket.write(`Size[${gameOptions.size}],Dimension[${gameOptions.dimension}],Maximum[${gameOptions.maximum}]: `)

    socket.on('data', (data) => {
        let msg = data.toString().replace('\n', '')

        // polecenia wczesnego zakończenia gry
        if (msg.toLowerCase() === 'stop') {
            socket.write("Game stopped")
            socket.destroy()
        }

        // gracz dostosowuje ustawienia gry
        if (!socket.optionsConfigured) {
            let newGameOptions = confiugreGame(socket, gameOptions, msg)
            if (!newGameOptions) {
                return
            }
            gameOptions = newGameOptions
            socket.write("Game configured!\n")
        }

        // Po skonfigurowaniu generujemy gre oraz ustawiamy jako trwającą
        if (socket.optionsConfigured && !gameSequence) {
            console.log(gameOptions)
            gameSequence = generateSequence(gameOptions)
            socket.onGoing = true
            socket.write("The game has started, guess with integers separated by a space\n")
            return
        }

        // logika gry
        if (socket.onGoing) {
            game(socket, gameOptions, msg, gameSequence)
        }
    })
})


// uruchamiamy serwer gry
app.listen(port, () => {
    console.log(`Serwer gry dostępny na porcie ${port}`);
});
