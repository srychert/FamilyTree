const deleteButton = document.getElementById("delete");

deleteButton.addEventListener('click', (e) => {
    axios.delete(`/users/${document.getElementById("id").value}`)
        .then(r => {
            console.log(r)
            window.location.pathname = "/"
        })
        .catch(e => console.log(e))
})