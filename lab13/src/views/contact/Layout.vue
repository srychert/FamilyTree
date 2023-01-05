<template>
    <div v-if="item">
        <h1>{{ item.name }}</h1>
        <div id="nav">
            <router-link :to="{ name: 'ContactDetails' }">Szczegóły</router-link>
            |
            <router-link :to="{ name: 'ContactAdd' }">Dodaj</router-link>
            |
            <router-link :to="{ name: 'ContactEdit' }">Edytuj</router-link>
        </div>
        <router-view :item="item" default="default" />
    </div>
</template>

<script>
import DataService from '@/services/DataService.js'

export default {
    props: ['id'],
    data() {
        return {
            item: null
            // id: 913455183822848 // teraz musimy „wstrzyknąć” id do kom,p[onentu]
        }
    },
    created() {
        // console.log('ID=' + this.id);
        DataService.getPerson(this.id)
            .then((response) => {
                console.log("OSOBA: " + response.data.name);
                this.item = response.data;
            })
            .catch((err) => {
                console.log(err);
                if (err.response && err.response.status === 404) {
                    this.$router.push({
                        name: '404NotFound',
                        params: { resource: 'wpis' }
                    })
                } else {
                    this.$router.push({ name: 'NetworkError'});
                }
            })

    }
}
</script>
