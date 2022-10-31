export const generateSequence = (gameOptions) => {
    let colors = [...Array(gameOptions.dim).keys()]
    let gameSequence = []
    for (let i = 0; i < gameOptions.size; i++) {
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        gameSequence.push(randomColor)
    }

    console.log(gameSequence)
    return gameSequence
}

export const getScore = (gameOptions, guess) => {
    const gameSequence = gameOptions.seq

    let score = {
        "black": 0,
        "white": 0
    }

    // numbers from guess that are not marked as black
    let checkedForBlackGuess = guess.filter((number, index) => number !== gameSequence[index])
    // numbers form game that are left over after checking for black
    let checkedForBlackGame = gameSequence.filter((number, index) => number !== guess[index])

    score.black = gameOptions.size - checkedForBlackGame.length

    checkedForBlackGuess.forEach(g => {
        let i = checkedForBlackGame.indexOf(parseInt(g))
        if (i !== -1) {
            checkedForBlackGame.splice(i, 1)
            score.white += 1
        }
    })

    return score
}

export const generateResponse = (gameOptions, score) => {
    let response = { 'gameid': gameOptions.gameid, score }

    if (response.score.black === gameOptions.size) {
        response.won = "You won!"
        return response
    }

    if (gameOptions.turnsLeft) {
        gameOptions.turnsLeft -= 1

        if (gameOptions.turnsLeft === 0) {
            response.lost = `You lost! The sequence was ${gameOptions.seq}`
        }

        response.turns = `Turns left: ${gameOptions.turnsLeft}`
    }

    return response
}