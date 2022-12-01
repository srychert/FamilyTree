const form = document.getElementById("login-form");
const login = form.elements['login'];
const password = form.elements['password'];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    axios.post("/login", {
        login: login.value,
        password: password.value
    })
        .then(r => {
            console.log(r)
            window.location.pathname = "/user/" + r.data.id
        })
        .catch(e => console.log(e))
})