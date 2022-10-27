import { v4 as uuidv4 } from 'uuid';
import express from "express";
import { game, generateSequence } from "./game.js";

const app = express()
const port = 3000

app.use(express.json())

let games = [];

// Make game
app.post('/mmind', (req, res) => {
    const { size, dim, max = 0 } = req.body
    if (!size || !dim) {
        console.log("bruh")
        res.status(400).send("Wrong request")
        return
    }

    const gameid = uuidv4();
    let game = {
        gameid,
        size,
        dim,
        max
    }

    res.send(JSON.stringify(game))

    if (max !== 0) {
        game.turnsLeft = max
    }

    game.seq = generateSequence(game)
    games.push(game)

})

app.patch('/mmind', (req, res) => {
    const guess = req.body

    if (!Array.isArray(guess)) {
        res.status(400).send("Wrong request - pls send array")
    }

    const gameid = guess[0]
    const gameOptions = games.filter(g => g.gameid === gameid)

    if (gameOptions.length === 0) {
        res.status(400).send(`Wrong request - game with id ${gameid} does not exist`)
    }

    const userGuess = guess.slice(1)

    if (userGuess.length !== gameOptions[0].size) {
        res.status(400).send("Wrong request - wrong length of guess")
    }

    let response = game(gameOptions[0], userGuess)

    if (response.lost) {
        games = games.filter(g => g !== gameid)
    }

    res.send(JSON.stringify(response))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})