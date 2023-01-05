<template>
    <p>adres: {{ item.address }}</p>
    <p>e-mail: {{ item.email }}</p>
    <p>wiek: {{ item.age }}</p>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    created() {
        console.log("Szczegóły kontaktu");
    }
}
</script>
