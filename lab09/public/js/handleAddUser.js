const form = document.getElementById("add-user-form");
const login = form.elements['login'];
const password = form.elements['password'];
const email = form.elements['email'];
const roles = form.elements['roles'];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    axios.post("/users", {
        login: login.value,
        password: password.value,
        email: email.value,
        registrationDate: new Date(),
        role: roles.value
    })
        .then(r => {
            console.log(r)
            window.location.pathname = "/"
        })
        .catch(e => console.log(e))

})