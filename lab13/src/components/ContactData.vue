<template>
  <router-link :to="{name: 'ContactDetails', params: {id: item.id}}">
    <div class="hello">
      <h1>{{ item.name }}</h1>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ContactData',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
