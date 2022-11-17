const updateButton = document.getElementById("update");
const fields = getElementsById("id", "login", "email");

updateButton.addEventListener('click', (e) => {
    axios.patch(`/users/${fields.id.value}`, {
        login: fields.login.innerText.trim(),
        email: fields.email.innerText.trim()
    })
        .then(r => {
            console.log(r)
            window.location.pathname = "/"
        })
        .catch(e => console.log(e))
})