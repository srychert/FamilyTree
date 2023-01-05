<template>
    <h1>Ojojoj!</h1>
    <div>
        Zasób typu „{{ resource }}”, który chciałeś wyświetlić nie istnieje
    </div>
    <router-link :to="{ name: 'ContactList' }">Powrót</router-link>
</template>

<script>
export default {
    props: {
        resource: {
            type: String,
            required: true,
            default: 'strona'
        }
    }
}
</script>
