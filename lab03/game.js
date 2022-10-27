export const generateSequence = (gameOptions) => {
    let colors = [...Array(gameOptions.dim).keys()]
    let gameSequence = []
    for (let i = 0; i < gameOptions.size; i++) {
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        gameSequence.push(randomColor)
    }

    console.log(gameSequence)
    return gameSequence
}

export const game = (gameOptions, guess) => {
    const gameSequence = gameOptions.seq
    let response = { 'gameid': gameOptions.gameid, 'black': 0, 'white': 0 }

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
        response.msg = "You won!"
    }

    if (gameOptions.turnsLeft) {
        gameOptions.turnsLeft -= 1

        if (gameOptions.turnsLeft === 0) {
            response.lost = `You lost! The sequence was ${gameSequence}`
        }

        response.turns = `Turns left: ${gameOptions.turnsLeft}`
    }

    return response
}