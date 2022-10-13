export const confiugreGame = (socket, gameOptions, msg) => {
    if (msg === '') {
        socket.optionsConfigured = true
        return gameOptions
    }

    let options = msg.split(',')

    if (options.length !== 3) {
        socket.write(`invalid number of arguments; got ${options.length} - should be 3\n`)
        return
    }

    try {
        let optionsList = options.map(option => {
            option = option.trim()
            if (option === '') {
                option = -1
            }
            return parseInt(option)
        })

        const setOption = (option, index) => {
            if (isNaN(optionsList[index])) {
                throw 'Option is not an integer!';
            }
            if (optionsList[index] > 0) {
                gameOptions[option] = optionsList[index]
            }
        }

        setOption('size', 0)
        setOption('dimension', 1)
        setOption('maximum', 2)
    } catch {
        socket.write('wrong option type; please send: int,int,int\n')
        return
    }

    socket.optionsConfigured = true
    return gameOptions
}