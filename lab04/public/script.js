const newGameForm = document.getElementById("new-game-form")
const gameForm = document.getElementById("game-form")
const statusTextNewGame = document.getElementById("status-new-game")
const statusTextGame = document.getElementById("status-game")

const gameIdInput = document.getElementById("game-id")
const scores = document.getElementById("scores")


newGameForm.addEventListener("submit", (e) => {
    e.preventDefault()
    scores.innerHTML = "";
    const data = new FormData(newGameForm);

    const newGameRequest = {}

    for (const [name, value] of data) {
        console.log(name, ":", value)
        newGameRequest[name] = value
    }

    axios.post("/mmind", newGameRequest)
        .then(r => {
            statusTextNewGame.textContent = "";
            const { gameid } = r.data
            gameIdInput.value = gameid
        })
        .catch(err => {
            console.log(err)
            statusTextNewGame.style.color = "red";
            statusTextNewGame.textContent = err.response.data.err;
        })
})

gameForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const data = new FormData(gameForm);
    let reqArr = []
    let guess

    for (const [name, value] of data) {
        console.log(name, ":", value)
        if (name === "guess") {
            guess = value
            reqArr.push(...value.split(",").map(v => parseInt(v.trim())))
        } else {
            reqArr.push(value)
        }
    }

    axios.patch("/mmind", reqArr)
        .then(r => {
            statusTextGame.textContent = "";
            const { score, lost, won } = r.data
            const li = document.createElement("li");
            li.innerText = `Guess: ${guess} Black: ${score.black} White: ${score.white}`
            scores.appendChild(li);

            if (lost) {
                alert(lost)
            }

            if (won) {
                alert(won)
            }
        })
        .catch(err => {
            console.log(err)
            statusTextGame.style.color = "red";
            statusTextGame.textContent = err.response.data.err;
        })
})