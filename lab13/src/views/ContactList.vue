<template>
  <div class="elements">
    <ContactData v-for="item in items"
      :key="item.id"
      :item="item"
    />
    <div class="navigation">
      <router-link
        :to="{ name: 'ContactList', query: {page: page - 1}}"
        v-if="page != 1"
        id="prev-page"
      >poprzednia</router-link>
      <router-link
        :to="{ name: 'ContactList', query: {page: page + 1}}"
        v-if="isNextPage"
        id="next-page"
      >kolejna</router-link>
    </div>
  </div>
</template>

<script>
// @ jako alias do ./src
import ContactData from "@/components/ContactData.vue";
import DataService from "@/services/DataService.js";
import { watchEffect } from "vue"

export default {
  name: "ContactList",
  props: ['page'],
  data() {
    return {
      items: null, // podobnie jak w przypadku pojedynczego kontaku – pobierzemy z serwera
      perPage: 3,
      totalItems: 0 // liczba kontaktów pobranych z serwisu
    };
  },
  created() {
    watchEffect(() => {
      this.items = null;
      DataService.getPersons(this.perPage, this.page)
      .then(response => {
        // console.log('pobrane dane:');
        // console.log(response);
        this.items = response.data;
        this.totalItems = response.headers["x-total-count"];
      })
      .catch(err => {
        console.log(err);
        this.$router.push({name: 'NetworkError'})
      })
    })
  },
  computed: {
    isNextPage() {
      const totalPages = Math.ceil(this.totalItems / this.perPage);
      return this.page < totalPages
    }
  },
  components: {
    ContactData,
  },
};
</script>

<style scoped>
  .elements {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .navigation {
    display: flex;
    width: 300px;
    font-weight: bold;
    margin-top: 2ex;
  }
  .navigation a {
    flex: 1;
    text-decoration: none;
    color: green;
  }
  #prev-page {
    text-align: left;
  }
  #next-page {
    text-align: right;
  }
</style>
