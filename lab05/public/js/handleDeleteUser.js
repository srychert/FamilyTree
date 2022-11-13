const button = document.getElementById("delete");
const id = document.getElementById("id").value;

button.addEventListener('click', (e) => {
    axios.delete(`/users/${id}`)
        .then(r => {
            console.log(r)
            window.location.pathname = "/"
        })
        .catch(e => console.log(e))
})