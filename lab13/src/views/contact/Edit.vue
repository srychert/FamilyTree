<template>
    <div>
        Edycja kontaktu
    </div>
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
        console.log("Edycja kontaktu");
    }
}
</script>
