import { v4 as uuidv4 } from 'uuid';
import express from "express";
import { generateResponse, generateSequence, getScore } from "./game.js";

const app = express()
const port = 3000

app.use(express.json())

let games = [];

// Make new game
app.post('/mmind', (req, res) => {
    // max of 0 means unlimited tries
    const { size, dim, max = 0 } = req.body
    if (!size || !dim) {
        res.status(400).send({ "err": "Wrong request - size or dim missing" })
        return
    }

    const gameid = uuidv4();
    let game = {
        gameid,
        size,
        dim,
        max
    }

    res.send(game)

    if (max !== 0) {
        game.turnsLeft = max
    }

    game.seq = generateSequence(game)
    games.push(game)

})

// Take guess
app.patch('/mmind', (req, res) => {
    const guess = req.body

    if (!Array.isArray(guess)) {
        res.status(400).send({ "err": "Wrong request - pls send array" })
        return
    }

    const gameid = guess[0]
    const gameOptions = games.filter(g => g.gameid === gameid)

    if (gameOptions.length === 0) {
        res.status(400).send({ "err": `Wrong request - game with id ${gameid} does not exist` })
        return
    }

    const userGuess = guess.slice(1)

    if (userGuess.length !== gameOptions[0].size) {
        res.status(400).send({ "err": `Wrong request - guess should be of length ${gameOptions[0].size} got ${userGuess.length}` })
        return
    }

    const score = getScore(gameOptions[0], userGuess)
    const response = generateResponse(gameOptions[0], score)

    if (response.lost || response.won) {
        games = games.filter(g => g.gameid !== gameid)
    }

    res.send(JSON.stringify(response))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})