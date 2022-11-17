const form = document.getElementById("add-user-form");
const login = form.elements['login'];
const password = form.elements['password'];
const email = form.elements['email'];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(login.value, email.value)

    axios.post("/users", {
        login: login.value,
        password: password.value,
        email: email.value,
        registrationDate: new Date()
    })
        .then(r => {
            console.log(r)
            window.location.pathname = "/"
        })
        .catch(e => console.log(e))

})