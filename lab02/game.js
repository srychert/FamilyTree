export const generateSequence = (gameOptions) => {
    let colors = [...Array(gameOptions.dimension).keys()]
    let gameSequence = []
    for (let i = 0; i < gameOptions.size; i++) {
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        gameSequence.push(randomColor)
    }

    console.log(gameSequence)
    return gameSequence
}

export const game = (socket, gameOptions, msg, gameSequence) => {
    let guess = msg.split(' ')
    let response = { 'black': 0, 'white': 0 }

    if (gameOptions.maximum !== 0 && !socket.turnsLeft) {
        socket.turnsLeft = gameOptions.maximum
    }

    if (guess.length !== gameOptions.size) {
        socket.write(`Your guesss should contain ${gameOptions.size} integers\n`)
        return
    }

    let checkedForBlackGuess = []
    let checkedForBlackGame = []

    guess.forEach((g, index) => {
        if (g != gameSequence[index]) {
            checkedForBlackGuess.push(g)
            checkedForBlackGame.push(gameSequence[index])
        }
    })

    response.black = gameOptions.size - checkedForBlackGame.length

    checkedForBlackGuess.forEach(g => {
        let i = checkedForBlackGame.indexOf(parseInt(g))
        if (i !== -1) {
            checkedForBlackGame.splice(i, 1)
            response.white += 1
        }
    })

    if (response.black === gameOptions.size) {
        socket.write("You won!")
        socket.destroy()
        return
    }

    if (socket.turnsLeft) {
        socket.turnsLeft -= 1

        if (socket.turnsLeft === 0) {
            let answer = gameSequence.reduce((acc, curr) => acc + `${curr} `, '')
            socket.write(`You lost!\nThe sequence was ${answer}`)
            socket.destroy()
            return
        }

        socket.write(`Turns lef: ${socket.turnsLeft} `)
    }

    socket.write(`Black: ${response.black} White: ${response.white}\n`)
}