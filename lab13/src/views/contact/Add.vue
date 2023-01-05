<template>
    <div>
        Dodawanie kontaktu
    </div>
    <button @click="addContact">Dodaj</button>
</template>

<script>
export default {
    props: ['item'],
    created() {
        console.log("Edycja kontaktu");
    },
    methods: {
        addContact() {
            // tworzymy i zapisujemy kontakt z pomocą (nieobecnego) API
            console.log("Dodawanie kontalktu");
            // „programowo” przełączamy sie na szczegóły kontaktu
            this.$router.push({
                name: 'ContactDetails' // ,
                // params: {id: this.item.id } // niepotrzebne
            })
            // ścieżka wygląda nastepujaco /person/:id/add
        }
    }
}
</script>
